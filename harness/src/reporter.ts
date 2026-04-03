import * as fs from 'fs';
import * as path from 'path';
import type { ModelResults, ReviewResult, RunMetrics } from './types.js';

/**
 * Reporter class for generating CSV and JSON reports from benchmark results.
 */
export class Reporter {
  private resultsDir: string;
  private reviewOutputDir: string;

  constructor(resultsDir: string, reviewOutputDir: string) {
    this.resultsDir = resultsDir;
    this.reviewOutputDir = reviewOutputDir;
  }

  /**
   * Generates all reports for benchmark results.
   */
  generateReports(modelResults: ModelResults[]): void {
    console.log('Generating reports...');
    
    // Generate JSON report
    this.generateJsonReport(modelResults);
    
    // Generate CSV report
    this.generateCsvReport(modelResults);
    
    // Generate individual run reports
    this.generateRunReports(modelResults);
    
    console.log('Reports generated successfully.');
  }

  /**
   * Generates a JSON report with all model results.
   */
  private generateJsonReport(modelResults: ModelResults[]): void {
    const reportPath = path.join(this.resultsDir, 'report.json');
    const reportData = {
      generatedAt: new Date().toISOString(),
      models: modelResults.map((result) => ({
        model: result.model,
        scored: result.scored,
        measured: result.measured,
        adamBench: result.adamBench,
        scoredStdDev: result.scoredStdDev,
        adamBenchStdDev: result.adamBenchStdDev,
        runs: result.runs.map((run) => ({
          runNumber: run.runNumber,
          completedTasks: run.completedTasks,
          totalIterations: run.totalIterations,
          totalTimeMs: run.totalTimeMs,
          generationTimeMinutes: run.generationTimeMinutes,
        })),
        reviews: result.reviews.map((review) => ({
          reviewer: review.reviewer,
          overallScore: review.scores.overallScore,
          taskCompletion: review.scores.taskCompletion,
          correctness: review.scores.correctness,
          codeQuality: review.scores.codeQuality,
          architectureMaintainability: review.scores.architectureMaintainability,
          simplicityVsOverengineering: review.scores.simplicityVsOverengineering,
          comment: review.scores.comment,
        })),
      })),
    };

    fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
    console.log(`JSON report written to: ${reportPath}`);
  }

  /**
   * Generates a CSV report with model comparison.
   */
  private generateCsvReport(modelResults: ModelResults[]): void {
    const csvPath = path.join(this.resultsDir, 'report.csv');
    
    // CSV header
    let csv = 'model,scored,measured,adamBench,scoredStdDev,adamBenchStdDev';
    
    // Add model rows
    for (const result of modelResults) {
      csv += `\n"${result.model}","${result.scored.toFixed(2)}","${result.measured.toFixed(2)}","${result.adamBench.toFixed(2)}","${result.scoredStdDev.toFixed(2)}","${result.adamBenchStdDev.toFixed(2)}"`;
    }
    
    fs.writeFileSync(csvPath, csv);
    console.log(`CSV report written to: ${csvPath}`);
  }

  /**
   * Generates individual run reports for each model.
   */
  private generateRunReports(modelResults: ModelResults[]): void {
    for (const result of modelResults) {
      const runReportPath = path.join(this.resultsDir, `${result.model.replace(/\s+/g, '_')}_run_report.json`);
      const runReportData = {
        model: result.model,
        scored: result.scored,
        measured: result.measured,
        adamBench: result.adamBench,
        runs: result.runs.map((run) => ({
          runNumber: run.runNumber,
          completedTasks: run.completedTasks,
          totalIterations: run.totalIterations,
          totalTimeMs: run.totalTimeMs,
          generationTimeMinutes: run.generationTimeMinutes,
        })),
        reviews: result.reviews.map((review) => ({
          reviewer: review.reviewer,
          overallScore: review.scores.overallScore,
          comment: review.scores.comment,
        })),
      };
      
      fs.writeFileSync(runReportPath, JSON.stringify(runReportData, null, 2));
    }
  }

  /**
   * Generates a detailed CSV report with all metrics.
   */
  generateDetailedCsvReport(modelResults: ModelResults[]): void {
    const csvPath = path.join(this.resultsDir, 'detailed_report.csv');
    
    // CSV header
    let csv = 'model,runNumber,completedTasks,totalIterations,totalTimeMs,generationTimeMinutes,scored,measured,adamBench';
    
    // Add rows for each run
    for (const result of modelResults) {
      for (const run of result.runs) {
        csv += `\n"${result.model}","${run.runNumber}","${run.completedTasks}","${run.totalIterations}","${run.totalTimeMs}","${run.generationTimeMinutes}","${result.scored.toFixed(2)}","${result.measured.toFixed(2)}","${result.adamBench.toFixed(2)}"`;
      }
    }
    
    fs.writeFileSync(csvPath, csv);
    console.log(`Detailed CSV report written to: ${csvPath}`);
  }

  /**
   * Generates a summary report with rankings.
   */
  generateSummaryReport(modelResults: ModelResults[]): void {
    const summaryPath = path.join(this.resultsDir, 'summary.json');
    
    // Sort models by AdamBench score
    const rankedModels = [...modelResults].sort((a, b) => b.adamBench - a.adamBench);
    
    const summaryData = {
      generatedAt: new Date().toISOString(),
      rankings: rankedModels.map((result, index) => ({
        rank: index + 1,
        model: result.model,
        adamBench: result.adamBench,
        scored: result.scored,
        measured: result.measured,
      })),
      bestModel: rankedModels[0],
    };
    
    fs.writeFileSync(summaryPath, JSON.stringify(summaryData, null, 2));
    console.log(`Summary report written to: ${summaryPath}`);
  }

  /**
   * Generates a text report for console output.
   */
  generateTextReport(modelResults: ModelResults[]): string {
    let text = 'AdamBench Results Summary\n';
    text += '========================\n\n';
    
    for (const result of modelResults) {
      text += `${result.model}:\n`;
      text += `  Scored:     ${result.scored.toFixed(2)}\n`;
      text += `  Measured:   ${result.measured.toFixed(2)}\n`;
      text += `  AdamBench:  ${result.adamBench.toFixed(2)}\n`;
      text += `  StdDev:     ${result.scoredStdDev.toFixed(2)} (scored), ${result.adamBenchStdDev.toFixed(2)} (adamBench)\n`;
      text += '\n';
    }
    
    return text;
  }
}