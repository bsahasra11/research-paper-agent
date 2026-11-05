import { PaperDocument } from '../types/paper';

export const LANDMARK_PAPERS: PaperDocument[] = [
  {
    id: 'attention-is-all-you-need',
    title: 'Attention Is All You Need',
    authors: [
      'Ashish Vaswani',
      'Noam Shazeer',
      'Niki Parmar',
      'Jakob Uszkoreit',
      'Llion Jones',
      'Aidan N. Gomez',
      'Łukasz Kaiser',
      'Illia Polosukhin',
    ],
    year: '2017',
    venue: 'Advances in Neural Information Processing Systems (NeurIPS 30)',
    abstract:
      'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable and requiring significantly less time to train. Our model achieves 28.4 BLEU on the WMT 2014 English-to-German translation task, improving over the existing best results, including ensembles, by over 2 BLEU. On the WMT 2014 English-to-French translation task, our model establishes a new single-model state-of-the-art BLEU score of 41.8 after training for 3.5 days on eight GPUs, a small fraction of the training costs of the best models from the literature.',
    pages: [
      {
        pageNumber: 1,
        text: `ATTENTION IS ALL YOU NEED\n\nAshish Vaswani*, Google Brain, avaswani@google.com\nNoam Shazeer*, Google Brain, noam@google.com\nNiki Parmar*, Google Research, nikip@google.com\nJakob Uszkoreit*, Google Research, usz@google.com\nLlion Jones*, Google Research, llion@google.com\nAidan N. Gomez* †, University of Toronto, aidan@cs.toronto.edu\nŁukasz Kaiser*, Google Brain, lukaszkaiser@google.com\nIllia Polosukhin* ‡, illia.polosukhin@gmail.com\n\nABSTRACT\nThe dominant sequence transduction models are based on complex recurrent or convolutional neural networks in an encoder-decoder configuration. In this work, we propose the Transformer, a network architecture eschewing recurrence and relying entirely on an attention mechanism to draw global dependencies between input and output. The Transformer allows for significantly more parallelization and can reach a new state of the art in translation quality after being trained for as little as twelve hours on eight P100 GPUs.`,
      },
      {
        pageNumber: 2,
        text: `1. INTRODUCTION\nRecurrent models typically factor computation along the symbol positions of the input and output sequences. Aligning the positions to steps in computation time, they generate a sequence of hidden states h_t, as a function of the previous hidden state h_{t-1} and the input for position t. This inherently sequential nature precludes parallelization within training examples, which becomes critical at longer sequence lengths, as memory constraints limit batching across examples.\n\nAttention mechanisms have become an integral part of compelling sequence modeling and transduction models in various tasks, allowing modeling of dependencies without regard to their distance in the input or output sequences. In all but a few cases however, such attention mechanisms are used in conjunction with a recurrent network.\n\nIn this work we propose the Transformer, a model architecture eschewing recurrence and instead relying entirely on an attention mechanism to draw global dependencies between input and output.`,
      },
      {
        pageNumber: 3,
        text: `3. MODEL ARCHITECTURE\nMost competitive neural sequence transduction models have an encoder-decoder structure. The encoder maps an input sequence of symbol representations (x_1, ..., x_n) to a sequence of continuous representations z = (z_1, ..., z_n). Given z, the decoder then generates an output sequence (y_1, ..., y_m) of symbols one element at a time.\n\nScaled Dot-Product Attention:\nWe compute the matrix of outputs as:\nAttention(Q, K, V) = softmax((Q K^T) / sqrt(d_k)) V\n\nMulti-Head Attention:\nMultiHead(Q, K, V) = Concat(head_1, ..., head_h) W^O\nwhere head_i = Attention(Q W_i^Q, K W_i^K, V W_i^V)\n\nWhere the projections are parameter matrices W_i^Q in R^{d_model x d_k}, W_i^K in R^{d_model x d_k}, W_i^V in R^{d_model x d_v} and W^O in R^{h d_v x d_model}.`,
      },
      {
        pageNumber: 4,
        text: `5. TRAINING AND RESULTS\nOn the WMT 2014 English-to-German translation task, the big transformer model (Transformer (big)) out-performs the best previously reported models (including ensembles) by more than 2.0 BLEU, establishing a new state-of-the-art BLEU score of 28.4.\n\nOn the WMT 2014 English-to-French translation task, our big model achieves a BLEU score of 41.8, outperforming all previously published single models and ensembles, at a fraction of the training cost of the previous state-of-the-art models.\n\nTraining Cost:\nOur model was trained on 8 NVIDIA P100 GPUs for 3.5 days (approx 300,000 steps). Previous leading models took up to 3 weeks on multiple clusters.`,
      },
    ],
    rawText: `Attention Is All You Need
Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Lukasz Kaiser, Illia Polosukhin.
NeurIPS 2017.
Abstract: The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. We propose the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. On WMT 2014 English-to-German, Transformer achieves 28.4 BLEU (+2.0 over previous best). On English-to-French, it reaches 41.8 BLEU.
Architecture: Multi-Head Attention, Scaled Dot-Product Attention: Attention(Q, K, V) = softmax(QK^T / sqrt(d_k)) V. Positional Encoding with sinusoidal functions PE(pos, 2i) = sin(pos/10000^(2i/d_model)).`,
    fileSize: '2.1 MB',
    isBenchmark: true,
    precomputedAnalysis: {
      paperTitle: 'Attention Is All You Need',
      authors: [
        'Ashish Vaswani',
        'Noam Shazeer',
        'Niki Parmar',
        'Jakob Uszkoreit',
        'Llion Jones',
        'Aidan N. Gomez',
        'Łukasz Kaiser',
        'Illia Polosukhin',
      ],
      publicationYear: '2017',
      institutionOrVenue: 'NeurIPS 2017 / Google Brain & Google Research',
      analyzedAt: '2026-11-05T06:12:00.000Z',
      modelUsed: 'gemini-3.8-flash',
      steps: {
        problemDefinition: {
          centralChallenge:
            'Sequential computation bottlenecks in Recurrent Neural Networks (RNNs, LSTMs, GRUs) that preclude parallelization during training across sequence length dimensions.',
          openQuestion:
            'Can sequence transduction model global temporal and contextual dependencies without relying on recurrent hidden-state transitions or convolutional receptive field hierarchies?',
          baselineLimitations: [
            'Sequential $O(n)$ recurrence forces step-by-step unrolling, underutilizing modern massively parallel GPU architectures.',
            'Difficulty capturing long-range dependencies due to gradient vanishing/exploding across long token distances.',
            'High computational cost ($O(k \\cdot n)$) in dilated convolutions like ByteNet or ConvS2S to link distant tokens.',
          ],
        },
        proposedMethodology: {
          novelArchitecture:
            'The Transformer: a purely self-attention-driven encoder-decoder architecture with 6 stacked identical layers, utilizing Multi-Head Attention and point-wise Feed-Forward Networks with residual connections and layer normalization.',
          mathematicalFormulation:
            '$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$$\n\n$$\\text{MultiHead}(Q, K, V) = \\text{Concat}(\\text{head}_1, \\dots, \\text{head}_h)W^O \\quad \\text{where} \\quad \\text{head}_i = \\text{Attention}(Q W_i^Q, K W_i^K, V W_i^V)$$\n\n$$\\text{PE}_{(pos, 2i)} = \\sin\\left(\\frac{pos}{10000^{2i/d_{model}}}\\right), \\quad \\text{PE}_{(pos, 2i+1)} = \\cos\\left(\\frac{pos}{10000^{2i/d_{model}}}\\right)$$',
          algorithmicFramework:
            'Self-attention projects token representations into queries ($Q$), keys ($K$), and values ($V$) of dimension $d_k = d_v = 64$. Scaled dot-product prevents the softmax gradient from vanishing in high dimensions. Sinusoidal positional encodings inject sequence order without recurring connections.',
          datasetsUsed: [
            'WMT 2014 English-to-German (4.5M sentence pairs, byte-pair encoding)',
            'WMT 2014 English-to-French (36M sentence pairs, 32k word-piece vocabulary)',
            'Penn Treebank (English Constituency Parsing evaluation)',
          ],
        },
        keyFindingsAndMetrics: {
          quantitativeResults: [
            {
              metricName: 'WMT 2014 En-De BLEU',
              paperValue: '28.4 BLEU',
              baselineValue: '26.4 BLEU (ConvS2S Ensemble)',
              relativeGain: '+2.0 BLEU (+7.58%)',
            },
            {
              metricName: 'WMT 2014 En-Fr BLEU',
              paperValue: '41.8 BLEU',
              baselineValue: '41.29 BLEU (MoE model)',
              relativeGain: '+0.51 BLEU (Single vs Ensemble)',
            },
            {
              metricName: 'Training FLOPs / GPU Time',
              paperValue: '3.5 days on 8 P100s',
              baselineValue: '21 days on 8 P100s (GNMT)',
              relativeGain: '6x Faster Training Efficiency',
            },
          ],
          baselineComparisons:
            'Surpassed state-of-the-art recurrent (GNMT) and convolutional (ConvS2S) translation models in BLEU score while requiring an order of magnitude fewer FLOPs during pretraining.',
          keyAchievements: [
            'Established the foundational architecture for all modern Large Language Models (LLMs).',
            'Proved that recurrence is completely dispensable for complex sequence-to-sequence translation.',
            'Demonstrated superior transfer learning capability on syntactic constituency parsing with no task-specific tuning.',
          ],
        },
        limitationsAndFutureWork: {
          notedConstraints: [
            'Quadratic computational and memory complexity $O(n^2)$ with respect to sequence length $n$, limiting maximum context window.',
            'Inability to process sequences longer than the maximum positional encoding without interpolation or degradation.',
            'Autoregressive generation at inference time remains sequential, creating token generation latency.',
          ],
          hardwareDependencies:
            'Trained on 8 NVIDIA P100 GPUs with high memory bandwidth; requires batched matrix multiplications for efficiency.',
          potentialBiases: [
            'Translation data limited to Western European language pairs (English, German, French).',
            'Sensitivity to hyperparameter tuning: warmup steps, label smoothing ($\\epsilon_{ls} = 0.1$), and dropout rates.',
          ],
          openDirections: [
            'Investigating sub-quadratic attention approximations (linear attention, sparse attention).',
            'Extending attention mechanisms to multimodal tasks involving images, video, and audio.',
            'Exploring unsupervised generative pretraining on large unannotated text corpora.',
          ],
        },
        executiveSummary: [
          'Introduces the Transformer, eliminating recurrence and convolutions in favor of multi-head self-attention mechanisms with $O(1)$ sequential operations.',
          'Attains record state-of-the-art translation accuracy (28.4 BLEU on En-De, 41.8 BLEU on En-Fr) while training 6x faster than existing recurrent ensembles.',
          'Inherits quadratic computational complexity $O(n^2)$ with sequence length, outlining the fundamental scaling challenge for future long-context architectures.',
        ],
      },
    },
  },
  {
    id: 'lora-low-rank-adaptation',
    title: 'LoRA: Low-Rank Adaptation of Large Language Models',
    authors: [
      'Edward J. Hu',
      'Yelong Shen',
      'Phillip Wallis',
      'Zeyuan Allen-Zhu',
      'Yuanzhi Li',
      'Shean Wang',
      'Lu Wang',
      'Weizhu Chen',
    ],
    year: '2021',
    venue: 'International Conference on Learning Representations (ICLR 2022)',
    abstract:
      'An important paradigm of natural language processing consists of large-scale pre-training on general domain data and adaptation to particular tasks or domains. As we pre-train larger models, full fine-tuning, which retrains all model parameters, becomes less feasible. We propose Low-Rank Adaptation, or LoRA, which freezes the pre-trained model weights and injects trainable rank decomposition matrices into each layer of the Transformer architecture, greatly reducing the number of trainable parameters for downstream tasks. Compared to fine-tuning of GPT-3 175B, LoRA can reduce the number of trainable parameters by 10,000 times and the GPU memory requirement by 3 times. LoRA performs on-par or better than fine-tuning in model quality on RoBERTa, DeBERTa, GPT-2, and GPT-3, despite having fewer trainable parameters, a higher training throughput, and, unlike adapters, no introduced inference latency.',
    pages: [
      {
        pageNumber: 1,
        text: `LORA: LOW-RANK ADAPTATION OF LARGE LANGUAGE MODELS\n\nEdward J. Hu*, Yelong Shen, Phillip Wallis, Zeyuan Allen-Zhu, Yuanzhi Li, Shean Wang, Lu Wang, Weizhu Chen\nMicrosoft Corporation\n\nABSTRACT\nAn important paradigm of natural language processing consists of large-scale pre-training on general domain data and adaptation to particular tasks or domains. As we pre-train larger models, full fine-tuning, which retrains all model parameters, becomes less feasible. Using GPT-3 175B as an example, deploying independent instances of fine-tuned models, each with 175B parameters, is prohibitive.\n\nWe propose Low-Rank Adaptation, or LoRA, which freezes the pre-trained model weights and injects trainable rank decomposition matrices into each layer of the Transformer architecture, greatly reducing the number of trainable parameters for downstream tasks.`,
      },
      {
        pageNumber: 2,
        text: `2. PROBLEM STATEMENT\nLet P_phi(y|x) be a pre-trained autoregressive language model parameterized by phi. During full fine-tuning, the model is initialized to pre-trained weights phi_0 and updated to phi_0 + Delta_phi by maximizing the conditional language modeling objective.\n\nOne of the main drawbacks is that for each downstream task, we learn a different set of parameters Delta_phi whose dimension |Delta_phi| equals |phi_0|. When |phi_0| is 175 Billion, storing and switching multiple task-specific models becomes an engineering impossibility.\n\n3. OUR METHOD\nWe hypothesize that weight updates during adaptation have a low "intrinsic dimension". For a pre-trained weight matrix W_0 in R^{d x k}, we constrain its update by representing it with a low-rank decomposition:\nW = W_0 + Delta W = W_0 + B A\nwhere B in R^{d x r}, A in R^{r x k}, and the rank r << min(d, k).`,
      },
      {
        pageNumber: 3,
        text: `4. EXPERIMENTAL EVALUATION\nWe evaluate LoRA on RoBERTa-base/large, DeBERTa-v3, GPT-2 medium/large, and GPT-3 175B on GLUE, E2E NLG Challenge, and WebNLG.\n\nKey Results on GPT-3 175B:\n- Full Fine-Tuning: 175,255.8M trainable parameters. WikiSQL: 73.8%.\n- Prefix-Tuning: 3.2M params. WikiSQL: 72.4%.\n- LoRA (r=4): 4.7M params. WikiSQL: 74.0%.\n- Trainable parameters reduced by 10,000x.\n- GPU VRAM consumption reduced from 1.2TB to 350GB.\n- Zero inference latency overhead: W = W_0 + B*A can be folded into weights during deployment.`,
      },
    ],
    rawText: `LoRA: Low-Rank Adaptation of Large Language Models.
Edward J. Hu et al. ICLR 2022.
Freezes pre-trained model weights and injects trainable rank decomposition matrices: W = W_0 + BA.
Reduces trainable parameters by 10,000x on GPT-3 175B and VRAM by 3x, with zero added inference latency by merging matrices into W_0.`,
    fileSize: '1.4 MB',
    isBenchmark: true,
    precomputedAnalysis: {
      paperTitle: 'LoRA: Low-Rank Adaptation of Large Language Models',
      authors: [
        'Edward J. Hu',
        'Yelong Shen',
        'Phillip Wallis',
        'Zeyuan Allen-Zhu',
        'Yuanzhi Li',
        'Shean Wang',
        'Lu Wang',
        'Weizhu Chen',
      ],
      publicationYear: '2021',
      institutionOrVenue: 'ICLR 2022 / Microsoft Corporation',
      analyzedAt: '2026-11-05T06:12:00.000Z',
      modelUsed: 'gemini-3.8-flash',
      steps: {
        problemDefinition: {
          centralChallenge:
            'Prohibitive compute, storage, and deployment costs of full parameter fine-tuning for massive foundation models (e.g. GPT-3 175B), where maintaining separate 350GB checkpoints per downstream task is unfeasible.',
          openQuestion:
            'Can task adaptation be parameterized with minimal degrees of freedom without degrading model generalization or introducing inference serving latencies?',
          baselineLimitations: [
            'Full fine-tuning stores full $|\\Phi_0|$ parameters per domain, exceeding cluster disk and memory capacity.',
            'Series adapter layers introduce sequential computation delays of up to 20% latency in low-batch inference.',
            'Prefix-tuning consumes input sequence length tokens ($O(l)$), reducing available context budget for user prompts.',
          ],
        },
        proposedMethodology: {
          novelArchitecture:
            'Low-Rank Adaptation (LoRA): Freezes the pre-trained weight matrix $W_0 \\in \\mathbb{R}^{d \\times k}$ and injects two low-rank trainable matrices $B \\in \\mathbb{R}^{d \\times r}$ and $A \\in \\mathbb{R}^{r \\times k}$ with intrinsic rank $r \\ll \\min(d, k)$.',
          mathematicalFormulation:
            '$$h = W_0 x + \\Delta W x = W_0 x + \\frac{\\alpha}{r} B A x$$\n\n$$\\text{Initialization: } A \\sim \\mathcal{N}\\left(0, \\frac{1}{r}\\right), \\quad B = 0 \\implies \\Delta W = 0 \\text{ at } t=0$$\n\n$$\\text{Deployment folding: } W_{deployed} = W_0 + \\frac{\\alpha}{r} BA$$',
          algorithmicFramework:
            'Applies matrix rank factorizations to the attention projection weights ($W_q, W_k, W_v, W_o$). $B$ is initialized to zero and $A$ to Gaussian random noise, ensuring $\\Delta W = 0$ at the start of training. A constant scaling factor $\\frac{\\alpha}{r}$ stabilizes tuning across rank values.',
          datasetsUsed: [
            'GLUE benchmark (MNLI, SST-2, MRPC, CoLA, QNLI, QQP, RTE, STS-B)',
            'E2E NLG Challenge (natural language generation from table slots)',
            'WebNLG Challenge 2017 & DART',
            'WikiSQL & MultiNLI for GPT-3 175B evaluations',
          ],
        },
        keyFindingsAndMetrics: {
          quantitativeResults: [
            {
              metricName: 'Trainable Parameters (GPT-3 175B)',
              paperValue: '4.7M parameters (LoRA $r=4$)',
              baselineValue: '175,255.8M parameters (Full FT)',
              relativeGain: '99.997% parameter reduction (10,000x)',
            },
            {
              metricName: 'WikiSQL Accuracy (GPT-3 175B)',
              paperValue: '74.0%',
              baselineValue: '73.8% (Full Fine-Tuning)',
              relativeGain: '+0.2% accuracy gain',
            },
            {
              metricName: 'GPU VRAM Memory Consumption',
              paperValue: '350 GB VRAM',
              baselineValue: '1,200 GB VRAM (Full FT)',
              relativeGain: '3x memory footprint savings',
            },
            {
              metricName: 'Inference Latency Overhead',
              paperValue: '0.0 ms (Exact match to pre-trained)',
              baselineValue: '+18% latency (Series Adapters)',
              relativeGain: 'Zero runtime degradation',
            },
          ],
          baselineComparisons:
            'Matched or outperformed full fine-tuning across RoBERTa, DeBERTa, and GPT-3 while enabling instant task switching by hot-swapping small $BA$ weight tensors in host RAM.',
          keyAchievements: [
            'Empirically demonstrated that weight adaptation matrices possess an intrinsic rank as low as $r=1$ or $r=4$.',
            'Pioneered zero-inference-overhead parameter-efficient fine-tuning via additive weight folding.',
            'Enabled democratized fine-tuning of 100B+ parameter models on consumer hardware setups.',
          ],
        },
        limitationsAndFutureWork: {
          notedConstraints: [
            'Simultaneous serving of multiple specialized tasks in a single batch requires dynamic unmerged execution or multi-tenant kernel support.',
            'Empirical testing was focused primarily on Transformer self-attention projections; MLP projections were largely frozen.',
          ],
          hardwareDependencies:
            'Optimized for standard NVIDIA Tensor Core GEMM operations; does not require custom hardware accelerators.',
          potentialBiases: [
            'Evaluated predominantly on English language classification and text generation benchmarks.',
            'Assumes the pre-trained foundational weights $W_0$ have already learned complete world knowledge representation.',
          ],
          openDirections: [
            'Combining low-rank decomposition with 4-bit/8-bit weight quantization (paving the way for QLoRA).',
            'Dynamic automated rank selection per layer based on gradient sensitivity.',
            'Investigating low-rank adaptation for vision transformers and diffusion models.',
          ],
        },
        executiveSummary: [
          'Proposes parameter-efficient fine-tuning via low-rank matrix decomposition ($W = W_0 + BA$), freezing base weights and training only low-rank tensors.',
          'Cuts trainable parameters by 10,000x and GPU memory by 3x on GPT-3 175B while achieving equal or superior task accuracy (+0.2% on WikiSQL).',
          'Eliminates inference overhead entirely by folding weights into base matrices, though multi-task batch serving requires specialized execution engines.',
        ],
      },
    },
  },
  {
    id: 'flashattention-fast-memory-efficient',
    title: 'FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness',
    authors: [
      'Tri Dao',
      'Daniel Y. Fu',
      'Stefano Ermon',
      'Atri Rudra',
      'Christopher Ré',
    ],
    year: '2022',
    venue: 'Advances in Neural Information Processing Systems (NeurIPS 2022)',
    abstract:
      'Transformers are slow and memory-hungry on long sequences, since the time and memory complexity of self-attention are quadratic in sequence length. Approximate attention methods have attempted to address this problem by trading off model quality to reduce the compute complexity, but often do not achieve wall-clock speedup. We argue that a missing principle is making attention algorithms IO-aware—accounting for reads and writes between levels of GPU memory. We propose FlashAttention, an IO-aware exact attention algorithm that uses tiling to reduce the number of memory reads/writes between GPU high bandwidth memory (HBM) and GPU on-chip SRAM. We analyze the IO complexity of FlashAttention, proving that it requires fewer HBM accesses than standard attention. FlashAttention trains Transformers faster than existing baselines: 15% end-to-end wall-clock speedup on BERT-large, 3x speedup on GPT-2, and enables 8x longer sequence lengths with exact attention.',
    pages: [
      {
        pageNumber: 1,
        text: `FLASHATTENTION: FAST AND MEMORY-EFFICIENT EXACT ATTENTION WITH IO-AWARENESS\n\nTri Dao*, Daniel Y. Fu*, Stefano Ermon, Atri Rudra, Christopher Ré\nDepartment of Computer Science, Stanford University\n\nABSTRACT\nTransformers are slow and memory-hungry on long sequences, since the time and memory complexity of self-attention are quadratic in sequence length. Approximate attention methods have attempted to address this problem by trading off model quality to reduce the compute complexity, but often do not achieve wall-clock speedup.\n\nWe argue that a missing principle is making attention algorithms IO-aware—accounting for reads and writes between levels of GPU memory. We propose FlashAttention, an IO-aware exact attention algorithm that uses tiling to reduce the number of memory reads/writes between GPU high bandwidth memory (HBM) and GPU on-chip SRAM.`,
      },
      {
        pageNumber: 2,
        text: `2. BACKGROUND: HARDWARE PERFORMANCE AND IO AWARENESS\nOn modern GPUs (e.g., NVIDIA A100), compute throughput (312 TFLOPs/s FP16) far outpaces High Bandwidth Memory (HBM) bandwidth (1.5–2.0 TB/s). In standard attention:\nS = Q K^T in R^{N x N} is written to HBM (O(N^2) memory IO)\nP = softmax(S) is read from and written to HBM (O(N^2) memory IO)\nO = P V is read from HBM\nFor large N, operations are heavily memory-bound, not compute-bound.\n\n3. FLASHATTENTION: ALGORITHM AND ANALYSIS\nWe address memory IO with two techniques:\n1. Tiling: Compute attention in blocks that fit in fast on-chip SRAM (192 KB per SM).\n2. Recomputation: Do not store intermediate N x N attention matrix P for the backward pass; recompute it on the fly in SRAM.`,
      },
    ],
    rawText: `FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness.
Tri Dao et al. NeurIPS 2022.
Standard attention is memory-bound due to O(N^2) HBM IO.
FlashAttention uses tiling and online softmax to compute exact attention in GPU SRAM with O(N^2 d^2 / M) HBM IO instead of O(N^2).
Yields 2-4x wall-clock speedup and enables up to 64k token context lengths.`,
    fileSize: '1.8 MB',
    isBenchmark: true,
    precomputedAnalysis: {
      paperTitle: 'FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness',
      authors: [
        'Tri Dao',
        'Daniel Y. Fu',
        'Stefano Ermon',
        'Atri Rudra',
        'Christopher Ré',
      ],
      publicationYear: '2022',
      institutionOrVenue: 'NeurIPS 2022 / Stanford University',
      analyzedAt: '2026-11-05T06:12:00.000Z',
      modelUsed: 'gemini-3.8-flash',
      steps: {
        problemDefinition: {
          centralChallenge:
            'Transformers suffer severe memory and wall-clock execution bottlenecks on long sequences because self-attention is IO-bound: repeatedly reading and writing $O(N^2)$ intermediate attention matrices to slow GPU High Bandwidth Memory (HBM).',
          openQuestion:
            'Can exact, unapproximated self-attention be computed significantly faster by optimizing memory reads and writes across the GPU memory hierarchy (HBM vs on-chip SRAM)?',
          baselineLimitations: [
            'Standard attention materializes $N \\times N$ intermediate similarity ($S$) and probability ($P$) matrices into GPU HBM, maxing out memory bandwidth.',
            'Approximate attention techniques (sparse, low-rank) sacrifice model accuracy without delivering real wall-clock speedups due to irregular memory access patterns.',
            'Sequence length $N$ was practically capped at 2k–4k tokens on modern GPUs before triggering Out-Of-Memory (OOM) failures.',
          ],
        },
        proposedMethodology: {
          novelArchitecture:
            'FlashAttention: an IO-aware exact attention algorithm leveraging GPU SRAM tiling and an online softmax trick to compute attention in small blocks without ever materializing the $N \\times N$ matrix in HBM.',
          mathematicalFormulation:
            '$$\\text{HBM IO Complexity: } \\mathcal{O}\\left(\\frac{N^2 d^2}{M}\\right) \\quad \\text{vs Standard Attention: } \\Theta(N d + N^2)$$\n\n$$\\text{Online Softmax Scaling: } m(x) = \\max(m(x^{(1)}), m(x^{(2)})), \\quad f(x) = \\left[e^{x_i - m(x)}\\right]$$\n\n$$l(x) = e^{m(x^{(1)}) - m(x)} l(x^{(1)}) + e^{m(x^{(2)}) - m(x)} l(x^{(2)})$$',
          algorithmicFramework:
            'Splits the inputs $Q, K, V$ into blocks that fit within fast on-chip SRAM (192KB per Streaming Multiprocessor on NVIDIA A100). Incremental online softmax normalization accumulates outputs across tiles, recomputing intermediate scores on-the-fly during the backward pass instead of saving them.',
          datasetsUsed: [
            'BERT-large on Wikipedia & BookCorpus',
            'GPT-2 (small & medium) on OpenWebText',
            'Long Range Arena (LRA) benchmark (1K to 4K token sequences)',
            'Path-X & Path-64 visual reasoning tasks (16K to 64K tokens)',
          ],
        },
        keyFindingsAndMetrics: {
          quantitativeResults: [
            {
              metricName: 'GPT-2 Training Speedup',
              paperValue: '3.0x wall-clock speedup',
              baselineValue: '1.0x (Standard HuggingFace Attention)',
              relativeGain: '+200% throughput increase',
            },
            {
              metricName: 'Maximum Context Length',
              paperValue: '64,000 tokens (Path-64 solved)',
              baselineValue: '2,048 tokens (Standard OOM threshold)',
              relativeGain: '32x context window expansion',
            },
            {
              metricName: 'HBM Memory Accesses',
              paperValue: '5.2x fewer HBM IO operations',
              baselineValue: 'Standard quadratic HBM traffic',
              relativeGain: '80.7% IO traffic reduction',
            },
            {
              metricName: 'BERT-large Pretraining Time',
              paperValue: '17.4 hours on 8x A100',
              baselineValue: '20.5 hours on 8x A100 (MLPerf baseline)',
              relativeGain: '15% end-to-end wall-clock speedup',
            },
          ],
          baselineComparisons:
            'Achieved faster wall-clock execution than existing approximate attention baselines (Linformer, Performer) while preserving mathematically exact attention weights.',
          keyAchievements: [
            'Proved theoretical lower bounds on memory IO for exact attention computation.',
            'Solved the challenging Path-64 benchmark for the first time in transformer history.',
            'Standardized GPU SRAM kernel design across subsequent LLM inference and training frameworks.',
          ],
        },
        limitationsAndFutureWork: {
          notedConstraints: [
            'Requires custom low-level CUDA and Triton kernel programming tailored specifically to GPU SRAM memory limits.',
            'Memory IO gains diminish for very small sequence lengths ($N < 512$) where compute, rather than memory bandwidth, dominates.',
            'Backward pass recomputation introduces extra arithmetic operations, relying on tensor cores to keep recompute costs negligible.',
          ],
          hardwareDependencies:
            'Targeted at modern NVIDIA GPU architectures (Turing, Ampere, Ada Lovelace, Hopper) with fast shared memory SRAM.',
          potentialBiases: [
            'Benchmarked primarily on dense autoregressive and masked language models; hardware profiles vary on non-NVIDIA accelerators.',
          ],
          openDirections: [
            'Extending IO-aware tiling to multi-query and grouped-query attention variants (FlashAttention-2).',
            'Compiling IO-aware kernels for non-GPU hardware like TPUs and Apple Silicon unified memory.',
            'Applying block tiling principles to graph neural networks and convolution-free vision backbones.',
          ],
        },
        executiveSummary: [
          'Engineers FlashAttention, an IO-aware exact attention algorithm that tiles computation in GPU SRAM to bypass quadratic High Bandwidth Memory traffic.',
          'Delivers up to 3x wall-clock training speedup on GPT-2 and scales context length by up to 8x-32x without approximating attention weights.',
          'Demonstrates that memory IO bandwidth, rather than raw FLOPs, is the primary operational bottleneck for long-sequence neural networks.',
        ],
      },
    },
  },
];
