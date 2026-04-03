import type { RunMetrics } from './types';

/**
 * Generates a markdown status file from RunMetrics
 */
export function generateStatusMd(metrics: RunMetrics): string {
  const prompts = metrics.prompts.map((p) => {
    let status = '✅ Completed';
    if (!p.completed) {
      status = '❌ Failed';
    }
    if (p.iterations > 1) {
      status += ` (after ${p.iterations} attempts)`;
    }
    if (p.failureReason) {
      status += ` - ${p.failureReason}`;
    }
    return status;
  });

  const completedPercent = Math.round((metrics.completedTasks / 5) * 100);

  return `# Benchmark Run Status

## Model Information

| Property | Value |
|----------|-------|
| **Model** | \`${metrics.model}\` |
| **Run Number** | \`${metrics.runNumber}\` |

## Timing

| Metric | Value |
|--------|-------|
| **Started** | \`${metrics.startedAt}\` |
| **Completed** | \`${metrics.completedAt}\` |
| **Total Time** | \`${Math.round(metrics.totalTimeMs / 1000)}s\` |
| **Generation Time** | \`${metrics.generationTimeMinutes} min\` |
| **Mean Decode TPS** | \`${metrics.meanDecodeTps.toFixed(2)} tokens/s\` |

## Task Completion

| Metric | Value |
|--------|-------|
| **Completed Tasks** | \`${metrics.completedTasks}\` / 5 |
| **Completion Rate** | \`${completedPercent}%\` |

## Prompt Results

| Prompt | Status | Iterations | Input Tokens | Output Tokens | Time |
|--------|--------|------------|--------------|---------------|------|
| 1 | \`${prompts[0]}\` | \`${metrics.prompts[0].iterations}\` | \`${metrics.prompts[0].inputTokens}\` | \`${metrics.prompts[0].outputTokens}\` | \`${Math.round(metrics.prompts[0].timeMs)}ms\` |
| 2 | \`${prompts[1]}\` | \`${metrics.prompts[1].iterations}\` | \`${metrics.prompts[1].inputTokens}\` | \`${metrics.prompts[1].outputTokens}\` | \`${Math.round(metrics.prompts[1].timeMs)}ms\` |
| 3 | \`${prompts[2]}\` | \`${metrics.prompts[2].iterations}\` | \`${metrics.prompts[2].inputTokens}\` | \`${metrics.prompts[2].outputTokens}\` | \`${Math.round(metrics.prompts[2].timeMs)}ms\` |
| 4 | \`${prompts[3]}\` | \`${metrics.prompts[3].iterations}\` | \`${metrics.prompts[3].inputTokens}\` | \`${metrics.prompts[3].outputTokens}\` | \`${Math.round(metrics.prompts[3].timeMs)}ms\` |
| 5 | \`${prompts[4]}\` | \`${metrics.prompts[4].iterations}\` | \`${metrics.prompts[4].inputTokens}\` | \`${metrics.prompts[4].outputTokens}\` | \`${Math.round(metrics.prompts[4].timeMs)}ms\` |

## Token Usage

| Metric | Value |
|--------|-------|
| **Total Input Tokens** | \`${metrics.totalInputTokens}\` |
| **Total Output Tokens** | \`${metrics.totalOutputTokens}\` |

## Tool Calls

| Tool | Count |
|------|-------|
| **Total** | \`${metrics.prompts.flatMap(p => p.toolCalls).length}\` |

## Validation Results

| Prompt | Build | Runtime | Browser |
|--------|------|---------|---------|
| 1 | \`${metrics.prompts[0].validationResults[0].passed ? '✅' : '❌'}\` | \`${metrics.prompts[0].validationResults[1].passed ? '✅' : '❌'}\` | \`${metrics.prompts[0].validationResults[2].passed ? '✅' : '❌'}\` |
| 2 | \`${metrics.prompts[1].validationResults[0].passed ? '✅' : '❌'}\` | \`${metrics.prompts[1].validationResults[1].passed ? '✅' : '❌'}\` | \`${metrics.prompts[1].validationResults[2].passed ? '✅' : '❌'}\` |
| 3 | \`${metrics.prompts[2].validationResults[0].passed ? '✅' : '❌'}\` | \`${metrics.prompts[2].validationResults[1].passed ? '✅' : '❌'}\` | \`${metrics.prompts[2].validationResults[2].passed ? '✅' : '❌'}\` |
| 4 | \`${metrics.prompts[3].validationResults[0].passed ? '✅' : '❌'}\` | \`${metrics.prompts[3].validationResults[1].passed ? '✅' : '❌'}\` | \`${metrics.prompts[3].validationResults[2].passed ? '✅' : '❌'}\` |
| 5 | \`${metrics.prompts[4].validationResults[0].passed ? '✅' : '❌'}\` | \`${metrics.prompts[4].validationResults[1].passed ? '✅' : '❌'}\` | \`${metrics.prompts[4].validationResults[2].passed ? '✅' : '❌'}\` |

## Detailed Prompt Information

${metrics.prompts.map((p, i) => {
  const errors = [];
  if (!p.validationResults[0].passed) errors.push(`Build: ${p.validationResults[0].errors.join(', ')}`);
  if (!p.validationResults[1].passed) errors.push(`Runtime: ${p.validationResults[1].errors.join(', ')}`);
  if (!p.validationResults[2].passed) errors.push(`Browser: ${p.validationResults[2].errors.join(', ')}`);

  return `### Prompt ${i + 1}

**Status:** ${p.completed ? '✅ Passed' : '❌ Failed'}  
**Iterations:** ${p.iterations}  
**Time:** ${Math.round(p.timeMs)}ms  
**Input Tokens:** ${p.inputTokens}  
**Output Tokens:** ${p.outputTokens}

${errors.length > 0 ? `**Errors:** \n${errors.map(e => `- ${e}`).join('\n')} ` : ''}
`;
}).join('\n')}

---
*Generated from RunMetrics for \`${metrics.model}\` run \`${metrics.runNumber}\`*
`;
}