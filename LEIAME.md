# Douglas Fiedler - Creative Technologist | Desenvolvedor Full Stack | Bacharelando em Engenharia da Computação

[🇺🇸 English Version (README.md)](README.md)

## 🚀 A Visão

Este projeto é um manifesto técnico e um portfólio vivo, arquitetado como um Sistema Operacional (D-VirtOS) totalmente interativo e baseado na web. Ele vai além de páginas estáticas para demonstrar um sistema robusto e multicamadas que simula um ciclo de vida completo de um SO, desde o boot até um ambiente de desktop funcional.

O objetivo principal é fornecer uma exibição prática de princípios avançados de engenharia de software, incluindo gerenciamento de máquinas de estado, arquitetura full-stack e conteinerização de infraestrutura.

## 🏛️ Arquitetura do Sistema

O D-VirtOS é modelado a partir de um sistema operacional do mundo real, com sua funcionalidade segmentada em camadas arquitetônicas distintas.

### Camada 0: Kernel e Abstração de Hardware
Esta camada fundamental é gerenciada pelo backend e pela infraestrutura, fornecendo serviços essenciais e um ambiente consistente.

*   **Kernel (API Laravel):** Um backend em Laravel 11 serve como o "kernel" do sistema, expondo uma API JSON de alta performance. Ele lida com a lógica central e fornece dados ao frontend, como as especificações de hardware simuladas servidas pelo endpoint `/api/boot-specs`.
*   **Hardware (Docker):** Todo o ambiente é orquestrado com Docker Compose, garantindo paridade perfeita entre desenvolvimento e produção. Essa conteinerização atua como a camada de abstração de hardware, definindo os componentes da máquina virtual:
    *   `api`: O contêiner da aplicação Laravel.
    *   `web`: O frontend React servido via Node.js.
    *   `db`: Um banco de dados MySQL 8.0 persistente para dados de sessão e usuário.
    *   `mailhog`: Um serviço para interceptar e testar e-mails.

### Camada 1: A Sequência de Boot
A aplicação frontend em React atua como uma sofisticada máquina de estados que guia o usuário através de um processo de boot simulado.

*   **BIOS (Basic Input/Output System):** O componente `BiosScreen` inicia a sequência, buscando e exibindo especificações de hardware simuladas da API Laravel. Ele escuta por entradas de teclado (`DEL`, `F12`) para imitar a entrada no setup ou em um menu de boot.
*   **GRUB (Bootloader):** Uma tela de bootloader dinâmica que simula a verificação de dispositivos e prepara o ambiente do sistema. Possui um fundo gerado proceduralmente usando filtros SVG para uma estética única.
*   **Gerenciador de Login:** O componente `LoginScreen` gerencia a autenticação do usuário. Ele apresenta diferentes perfis de acesso (ex: Recrutador, Desenvolvedor) e usa a Context API do React e o `sessionStorage` para estabelecer e persistir um estado de sessão, fazendo a ponte entre o estágio de boot e o desktop do usuário.

### Camada 2: O Ambiente de Desktop
Após um "login" bem-sucedido, o usuário entra em uma interface gráfica de usuário com múltiplas janelas. Este ambiente é o shell principal da aplicação, projetado para apresentar meu portfólio, projetos e serviços profissionais em um formato imersivo e interativo.

## ✅ Funcionalidades Implementadas

*   **Simulação Completa de Boot:** Telas funcionais de BIOS, GRUB e Login com transições cronometradas.
*   **Especificações de Hardware via API:** A tela da BIOS busca dados dinamicamente do backend Laravel.
*   **Acesso Baseado em Perfil:** A tela de login oferece múltiplos perfis de usuário que personalizam a experiência.
*   **Gerenciamento de Sessão:** O tipo de sessão do usuário é registrado no "kernel do sistema" (React Context) e persistido no `sessionStorage`.
*   **Login Automático de Visitante:** Um temporizador de 30 segundos na tela de login assume uma sessão de 'Visitante', garantindo a acessibilidade.
*   **Ambiente Conteinerizado:** Totalmente orquestrado com Docker para confiabilidade e fácil configuração.

## 🛠️ Stack Técnica

*   **Infraestrutura:** **Docker Compose** orquestrando serviços Node.js (v20), PHP (v8.3), MySQL (v8.0) e MailHog.
*   **Backend:** **Laravel 11** configurado como uma API JSON stateless.
*   **Frontend:** **React 18+** com **TypeScript** e **Vite**. Utiliza tipagem estrita, React Hooks (`useState`, `useEffect`, `useContext`) e a Context API para um gerenciamento de estado robusto.
*   **Estilização:** **Tailwind CSS** para uma abordagem de estilização utility-first, permitindo o desenvolvimento rápido de uma UI customizada e responsiva.
*   **Banco de Dados:** **MySQL 8.0** com um volume gerenciado pelo Docker para persistência de dados.

## 🚀 Como Executar

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/dognew/site-so.git
    cd site-so
    ```

2.  **Construa e execute os contêineres Docker:**
    ```bash
    docker-compose up -d --build
    ```

3.  **Acesse a aplicação:**
    Abra seu navegador e navegue para `http://localhost:5173`.

A API do backend estará disponível em `http://localhost:8000`.

## 🏗️ Arquitetura do Projeto

O D-VirtOS segue uma arquitetura estrita baseada em camadas, espelhando a separação de responsabilidades encontrada em sistemas operacionais modernos baseados em Unix.

### 📂 Hierarquia do Sistema de Arquivos e Mapeamento de Camadas

* **`/public/dvirtos/usr/share`**: Assets estáticos seguindo o **FHS (Filesystem Hierarchy Standard)**. Contém temas do sistema, cursores do X11 e ícones.
* **`src/kernel/`**: Orquestração central (**Camadas 0-3**). Gerencia sessões, servidores de exibição (XServer) e empilhamento de janelas.
* **`src/system/`**: O **D-VirtUI Toolkit**. Bibliotecas de sistema compartilhadas e controles de UI reutilizáveis (As "DLLs" do SO).
* **`src/shell/`**: **Camada 4** (Ambiente de Desktop). Lida com a Barra de Tarefas, Menu Iniciar e lógica de interação com o Desktop.
* **`src/apps/`**: **Camada 5** (Espaço do Usuário). Aplicações virtuais rodando dentro do ambiente do sistema.

### 🌳 Estrutura do Projeto

```text
frontend/
├── 📂 public/ (Camada de Assets Estáticos - Estilo FHS)
│   ├── 📂 dvirtos/
│   │   └── 📂 usr/
│   │       └── 📂 share/
│   │           ├── 📂 icons/
│   │           │   ├── 📂 dvirtos-cursors/
│   │           │   │   ├── 📂 cursors/ (left_ptr.svg, x-cursor.svg, etc.)
│   │           │   │   └── index.theme
│   │           │   └── 📂 dvirtos_logos/ (dvirtos-logo.svg)
│   │           └── 📂 themes/
│   │               └── 📂 dvirtos-default/ (cursor.css, window.css)
│   ├── 📂 icons/
│   │   └── 📂 os/ (biglinux.svg, debian.svg, linuxmint.svg)
│   ├── .htaccess
│   └── logo-dognew-white-gold.svg
│
├── 📂 src/ (Código Fonte do Sistema & Lógica)
│   ├── 📂 assets/
│   │   ├── 📂 fonts/ (eightbit-atari-90.ttf)
│   │   └── react.svg
│   │
│   ├── 📂 components/
│   │   ├── 📂 boot/ (Camada 1: Sequência de Boot - BIOS, GRUB, Login)
│   │   │   ├── 📂 bios/ (BiosSetup.tsx, ExitModal.tsx)
│   │   │   ├── 📂 grub/ (GrubBackground.tsx, GrubScreen.tsx)
│   │   │   ├── BiosScreen.tsx
│   │   │   ├── BootMenu.tsx
│   │   │   └── LoginScreen.tsx
│   │   │
│   │   ├── 📂 kernel/ (Camadas 0-3: O Motor do Sistema)
│   │   │   ├── SessionManager.tsx
│   │   │   ├── WindowManager.tsx
│   │   │   └── XServer.tsx
│   │   │
│   │   ├── 📂 system/ (D-VirtUI Toolkit: Bibliotecas & Compartilhados)
│   │   │   ├── 📂 Window/
│   │   │   │   └── Window.tsx
│   │   │   ├── 📂 Controls/ (Futuro: SysButton.tsx, SysInput.tsx)
│   │   │   ├── 📂 Admin/ (Ferramentas de Backdoor & Inspeção)
│   │   │   │   ├── AdminShell.tsx
│   │   │   │   └── SessionInspector.tsx
│   │   │   └── 📂 Shared/ (BootTimer.tsx)
│   │   │
│   │   ├── 📂 shell/ (Camada 4: Ambiente de Desktop)
│   │   │   ├── 📂 taskbar/
│   │   │   │   └── 📂 applets/ (Bateria, Relógio, Rede, Volume)
│   │   │   ├── 📂 desktop/ (DesktopIcon.tsx)
│   │   │   ├── StartMenu.tsx
│   │   │   └── DesktopShell.tsx
│   │   │
│   │   └── 📂 apps/ (Camada 5: Espaço do Usuário / Binários Virtuais)
│   │       ├── 📂 Terminal/ (TerminalTest.tsx)
│   │       ├── 📂 Settings/ (DesktopSettings.tsx)
│   │       └── 📂 Welcome/ (WelcomeApp.tsx)
│   │
│   ├── 📂 context/ (Estado Global do Sistema)
│   │   └── SessionContext.tsx
│   │
│   ├── 📂 hooks/ (Abstrações de Hardware & Interação)
│   │   ├── useAdminKeys.ts
│   │   ├── useHardware.ts
│   │   └── useWindowInteractions.ts
│   │
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
│
└── 📂 dist/ (Build Otimizada para Produção)
```

### 🧩 Matriz de Responsabilidade das Camadas do Sistema

| Camada | Componente | Responsabilidade |
| :--- | :--- | :--- |
| **0** | SessionManager | Orquestração do estado global, simulação de hardware e persistência. |
| **1** | XServer | Simulação do servidor de exibição, mascaramento de entrada e canvas pontilhado (stippled). |
| **3** | WindowManager | Gerenciamento do ciclo de vida das janelas, empilhamento (z-index) e geometria. |
| **4** | DesktopShell | Ambiente do shell da UI, Barra de Tarefas, Menu Iniciar e Grade do Desktop. |
| **5** | UserSpace | Aplicações virtuais finais (Terminal, Configurações, Welcome App). |