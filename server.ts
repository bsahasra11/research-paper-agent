import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Enable large JSON bodies for uploaded PDF extracted text and pages
app.use(express.json({ limit: '50mb' }));

// Server-side initialization of Google Gen AI SDK
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    time: new Date().toISOString(),
  });
});

// Rigorous Paper Analysis Agent Endpoint
app.post('/api/analyze-paper', async (req: Request, res: Response) => {
  try {
    const { paperTitle, rawText, pages, authors, year } = req.body;

    if (!rawText && (!pages || pages.length === 0)) {
      return res.status(400).json({
        error: 'Missing paper text content. Please upload a valid PDF document with extractable text.',
      });
    }

    // Combine extracted text (first 30,000 characters to stay within efficient reasoning window while capturing key sections)
    let paperContent = rawText || '';
    if (!paperContent && Array.isArray(pages)) {
      paperContent = pages.map((p: { pageNumber: number; text: string }) => `--- PAGE ${p.pageNumber} ---\n${p.text}`).join('\n\n');
    }

    if (paperContent.length > 35000) {
      paperContent = paperContent.slice(0, 35000) + '\n\n[... Remaining content truncated for optimal analysis ...]';
    }

    const systemInstruction = `You are an expert Research Paper Assistant Agent. Your role is to analyze academic papers, technical preprints, and abstracts, extracting structured insights using a rigorous step-by-step reasoning process.

Chain-of-Thought (CoT) Instructions:
When given a research paper or abstract, perform your analysis strictly in the following sequence:
1. PROBLEM DEFINITION: Identify the central challenge or open question the authors are addressing.
2. PROPOSED METHODOLOGY: Summarize the novel architecture, algorithm, dataset, or empirical framework introduced. Include clear, rigorous LaTeX mathematical formulas (using standard LaTeX like $$...$$ for display equations and $...$ for inline equations).
3. KEY FINDINGS & METRICS: Highlight quantitative results, baseline comparisons, and key achievements. Include exact numerical values, percentage improvements, and benchmark metrics where available.
4. LIMITATIONS & FUTURE WORK: Point out any noted constraints, hardware dependencies, potential biases, or open directions.
5. EXECUTIVE SUMMARY: Provide a concise 3-bullet takeaway optimized for a fast technical review. Exactly 3 distinct bullets.`;

    const userPrompt = `Please analyze the following academic research paper document according to the strict 5-step Chain-of-Thought (CoT) protocol:

Title: ${paperTitle || 'Unknown / Extracted from Document'}
${authors && authors.length > 0 ? `Authors: ${authors.join(', ')}` : ''}
${year ? `Year: ${year}` : ''}

Document Content:
${paperContent}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            paperTitle: { type: Type.STRING, description: 'Formal academic paper title' },
            authors: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'List of authors identified in the preprint',
            },
            publicationYear: { type: Type.STRING, description: 'Year of publication or preprint release' },
            institutionOrVenue: { type: Type.STRING, description: 'Publishing venue, conference, or academic institutions' },
            steps: {
              type: Type.OBJECT,
              properties: {
                problemDefinition: {
                  type: Type.OBJECT,
                  properties: {
                    centralChallenge: { type: Type.STRING, description: 'The fundamental bottleneck or technical hurdle' },
                    openQuestion: { type: Type.STRING, description: 'The core research question investigated' },
                    baselineLimitations: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: 'Limitations of previous baselines and prior art',
                    },
                  },
                  required: ['centralChallenge', 'openQuestion', 'baselineLimitations'],
                },
                proposedMethodology: {
                  type: Type.OBJECT,
                  properties: {
                    novelArchitecture: { type: Type.STRING, description: 'Overview of the proposed architecture or mechanism' },
                    mathematicalFormulation: {
                      type: Type.STRING,
                      description: 'Key mathematical formulation and loss functions with LaTeX formatting ($$...$$ and $...$)',
                    },
                    algorithmicFramework: { type: Type.STRING, description: 'Step-by-step operational and training workflow' },
                    datasetsUsed: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: 'Evaluated benchmarks, synthetic data, or corpora',
                    },
                  },
                  required: ['novelArchitecture', 'mathematicalFormulation', 'algorithmicFramework', 'datasetsUsed'],
                },
                keyFindingsAndMetrics: {
                  type: Type.OBJECT,
                  properties: {
                    quantitativeResults: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          metricName: { type: Type.STRING },
                          paperValue: { type: Type.STRING },
                          baselineValue: { type: Type.STRING },
                          relativeGain: { type: Type.STRING },
                        },
                        required: ['metricName', 'paperValue', 'baselineValue', 'relativeGain'],
                      },
                      description: 'Tabular comparison of key quantitative metrics vs baselines',
                    },
                    baselineComparisons: { type: Type.STRING, description: 'Summary of comparisons against prior state of the art' },
                    keyAchievements: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: 'Breakthrough accomplishments demonstrated by the paper',
                    },
                  },
                  required: ['quantitativeResults', 'baselineComparisons', 'keyAchievements'],
                },
                limitationsAndFutureWork: {
                  type: Type.OBJECT,
                  properties: {
                    notedConstraints: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: 'Theoretical, computational, or scoping constraints',
                    },
                    hardwareDependencies: { type: Type.STRING, description: 'Compute hardware, GPU setups, and training resources' },
                    potentialBiases: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: 'Dataset biases, evaluation limitations, or failure modes',
                    },
                    openDirections: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: 'Promising future research trajectories',
                    },
                  },
                  required: ['notedConstraints', 'hardwareDependencies', 'potentialBiases', 'openDirections'],
                },
                executiveSummary: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Exactly 3 concise bullet takeaways optimized for fast technical review',
                },
              },
              required: [
                'problemDefinition',
                'proposedMethodology',
                'keyFindingsAndMetrics',
                'limitationsAndFutureWork',
                'executiveSummary',
              ],
            },
          },
          required: ['paperTitle', 'steps'],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Gemini API returned an empty response.');
    }

    const parsedJson = JSON.parse(text);

    // Attach metadata
    const result = {
      ...parsedJson,
      analyzedAt: new Date().toISOString(),
      modelUsed: 'gemini-3.8-flash',
    };

    return res.json(result);
  } catch (error: any) {
    console.error('Paper analysis error:', error);
    return res.status(500).json({
      error: error?.message || 'An error occurred during paper analysis.',
      code: error?.status || 500,
    });
  }
});

// Setup Vite in development or static serving in production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ScholarCoT Server] Running on http://0.0.0.0:${PORT} (env: ${process.env.NODE_ENV || 'development'})`);
  });
}

startServer();
