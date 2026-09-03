# System Architecture & Technical Specifications

> **ECHO: Evaluative Cognitive Heuristic Oracle**  
> Enterprise System Architecture, Cognitive Modeling Taxonomy, and Simulation Pipeline Specification.

---

## 1. High-Level System Architecture

ECHO operates as a reactive, distributed, full-stack intelligence system composed of four coordinated subsystem tiers:

```mermaid
graph TB
    subgraph Client["Presentation & Simulation Layer (React 19 + Three.js)"]
        UI["Reactive Shell (Layout, Views, Modals)"]
        Canvas3D["Hardware Accelerated WebGL Engine (Three.js + R3F)"]
        State["UI Context & Realtime State Store"]
        Audio["Voice Copilot (Web Speech API)"]
    end

    subgraph Transport["Realtime & Streaming Transport Layer"]
        HTTPGateway["Express REST Gateway (:3000)"]
        SocketHub["Socket.io WebSocket Event Relay"]
    end

    subgraph Logic["Application & Observability Layer"]
        RateLimiter["Sliding-Window Rate Limiter (Token Bucket)"]
        Telemetry["Structured JSON Logging & Health Probes (/healthz, /readyz)"]
        Lifecycle["Graceful Shutdown Manager (SIGTERM / SIGINT)"]
    end

    subgraph Intelligence["Foundation Intelligence Tier"]
        GeminiAPI["Google Gemini 3.6 Flash Engine"]
        FallbackCascade["Model Fallback Cascader (3.6 -> 2.0 -> 1.5)"]
        SocraticPrompt["Socratic System Instruction Engine"]
    end

    UI --> State
    State --> Canvas3D
    Audio --> HTTPGateway
    State <--> SocketHub
    HTTPGateway --> RateLimiter
    RateLimiter --> GeminiAPI
    GeminiAPI --> FallbackCascade
    FallbackCascade --> SocraticPrompt
    SocketHub --> Telemetry
    HTTPGateway --> Telemetry
    Telemetry --> Lifecycle
```

---

## 2. The Socratic Cognitive Fragility Index (CFI)

Unlike classical generative conversational tutors that provide direct answers upon prompting, ECHO implements a **Cognitive Fragility State Machine**:

```mermaid
stateDiagram-v2
    [*] --> AssertionPhase: Student Asserts Hypothesis
    AssertionPhase --> LexicalAnalysis: Extract Cognitive Entities
    LexicalAnalysis --> FragilityScoring: Evaluate Against Physics Invariants
    
    state FragilityScoring {
        [*] --> Robust: Defensible Intuition (CFI < 0.25)
        [*] --> Ambiguous: Fragmented Reasoning (0.25 <= CFI < 0.65)
        [*] --> Fragile: Fundamental Misconception (CFI >= 0.65)
    }

    Robust --> ChallengeMode: Escalate Problem Complexity
    Ambiguous --> SocraticInterrogation: Ask Probing Contradiction Question
    Fragile --> EmpiricalCounterexample: Launch 3D Simulation with Overridden Variables

    EmpiricalCounterexample --> ReformulationPhase: Student Observes Physical Contradiction
    SocraticInterrogation --> ReformulationPhase: Student Resolves Logical Discrepancy
    ReformulationPhase --> AssertionPhase: Student Resubmits Mental Model
    ChallengeMode --> [*]: Proof of Understanding Minted
```

### Fragility Formulation
The Cognitive Fragility Index $\text{CFI} \in [0, 1]$ is dynamically estimated based on:
$$\text{CFI} = w_1 \cdot \mathcal{D}_{\text{misconception}} + w_2 \cdot (1 - \mathcal{C}_{\text{confidence}}) + w_3 \cdot \mathcal{V}_{\text{variance}}$$

Where:
- $\mathcal{D}_{\text{misconception}}$: Distance to known intuitive traps (e.g. Aristotelian falling body fallacy, quantum trajectory realism).
- $\mathcal{C}_{\text{confidence}}$: Expressed semantic epistemic certainty.
- $\mathcal{V}_{\text{variance}}$: Inconsistency across parameter adjustments in empirical simulations.

---

## 3. WebGL Hardware Accelerated 3D Physics Pipeline

ECHO provides 10 real-time interactive simulations operating at 60 FPS across WebGL 2.0 contexts:

| Simulation Domain | Mathematical Model | Parameter Bounds | Visual Rendering Technique |
| :--- | :--- | :--- | :--- |
| **Gravitational Freefall** | Newtonian drag & vacuum trajectories | $g \in [1.6, 24.8]\,\text{m/s}^2$, $m \in [0.1, 100]\,\text{kg}$ | Mesh standard materials with dynamic shadow maps |
| **Keplerian Orbits** | Two-body central force problem ($\vec{F} = -G\frac{Mm}{r^3}\vec{r}$) | $M \in [0.1, 10]\,M_\odot$, $v_0 \in [5, 50]\,\text{km/s}$ | Catmull-Rom spline orbital trails |
| **Quantum Double Slit** | Young wave interference & de Broglie matter waves | $\lambda \in [380, 750]\,\text{nm}$, $d \in [0.01, 1]\,\text{mm}$ | Custom fragment shaders calculating wavefunction intensity |
| **Electromagnetic Induction** | Faraday's Law ($\mathcal{E} = -\frac{d\Phi_B}{dt}$) | $B \in [0.1, 5.0]\,\text{T}$, $\omega \in [0, 100]\,\text{rad/s}$ | Vector field arrows and dynamic magnetic flux lines |
| **Thermodynamic Entropy** | Maxwell-Boltzmann particle kinetics | $N \in [50, 1000]$, $T \in [100, 1000]\,\text{K}$ | InstancedMesh particle collisions with spatial partitioning |
| **Special Relativity** | Lorentz Contraction & Time Dilation ($\gamma$) | $v \in [0, 0.999c]$ | Relativistic Doppler shift color-space transform |

---

## 4. Real-Time Collaborative State Relay (Socket.io)

For multi-student collaborative problem-solving, ECHO establishes a room-isolated event fabric:

```mermaid
sequenceDiagram
    autonumber
    participant StudentA as Student Alice (Client)
    participant Relay as Node.js Socket Relay
    participant StudentB as Student Bob (Client)

    StudentA->>Relay: join_sim (room: "orbit-mechanics-101")
    Relay->>StudentA: user_count (count: 1)
    StudentB->>Relay: join_sim (room: "orbit-mechanics-101")
    Relay->>StudentA: user_count (count: 2)
    Relay->>StudentB: user_count (count: 2)

    StudentA->>Relay: sim_param_change ({ gravity: 14.2, mass: 50 })
    Relay-->>StudentB: sim_param_update ({ gravity: 14.2, mass: 50 })
    
    StudentB->>Relay: cursor_move ({ x: 0.45, y: 0.82 })
    Relay-->>StudentA: remote_cursor ({ id: "bob", cursor: { x: 0.45, y: 0.82 } })
```

---

## 5. Security & Production Hardening

1. **Non-Root Execution**: Runs inside Docker as unprivileged user `node` (UID 1000).
2. **Layer Isolation**: Frontend assets are compiled during build stage; secrets (`GEMINI_API_KEY`) are exclusively bound at server runtime and never exposed to the client bundle.
3. **Observability Probes**: Standardized Kubernetes `/healthz` (liveness) and `/readyz` (readiness) HTTP endpoints.
4. **Rate Limiting**: Sliding-window limiter on `/api/chat` protecting from DDoS and quota exhaustion.
5. **Graceful Termination**: Handles `SIGTERM` / `SIGINT` with connection draining and clean process exit.
