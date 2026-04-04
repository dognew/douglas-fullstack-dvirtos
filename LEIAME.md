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
├── 🔑 .env.development           # Variáveis de ambiente (Desenvolvimento)
├── 🔑 .env.production            # Variáveis de ambiente (Produção)
├── 📜 .gitignore                 # Regras de exclusão do Git
├── 📜 eslint.config.js           # Configuração de linting e qualidade de código
├── 📜 index.html                 # Ponto de entrada HTML principal para o Vite
├── 📜 package.json               # Dependências do projeto e scripts de ciclo de vida
├── 📜 package-lock.json          # Árvore de dependências determinística (lock)
├── 📜 postcss.config.js          # Processamento PostCSS para Tailwind CSS
├── 📜 tailwind.config.js         # Configuração do design system Tailwind CSS
├── 📜 tsconfig.app.json          # Configuração TypeScript para a aplicação
├── 📜 tsconfig.json              # Configuração principal do projeto TypeScript
├── 📜 tsconfig.node.json         # Configuração TypeScript para ferramentas de build
├── 📜 vite.config.ts             # Configuração de build e servidor do Vite
│
├── 📂 public/ (Camada de Assets Estáticos - Estilo FHS)
│   ├── 📂 dvirtos/
│   │   └── 📂 usr/
│   │       └── 📂 share/
│   │           ├── 📂 icons/
│   │           │   ├── 📂 dvirtos-cursors/         # Cursores de mouse simulando X11
│   │           │   │   ├── 📂 cursors/
│   │           │   │   │   ├── 🖼️ left_ptr.svg
│   │           │   │   │   ├── 🖼️ pointer.svg
│   │           │   │   │   ├── 🖼️ size_hor.svg
│   │           │   │   │   ├── 🖼️ size_ver.svg
│   │           │   │   │   └── 🖼️ x-cursor.svg
│   │           │   │   └── 📜 index.theme          # Definição do tema de cursor
│   │           │   ├── 📂 dvirtos_logos/           # Logos oficiais do sistema
│   │           │   │   └── 🖼️ dvirtos-logo.svg
│   │           │   └── 📂 os/                      # Logos de SOs de terceiros para GRUB/Login
│   │           │       ├── 🖼️ biglinux.svg
│   │           │       ├── 🖼️ debian.svg
│   │           │       └── 🖼️ linuxmint.svg
│   │           └── 📂 themes/                      # Temas CSS globais do sistema
│   │               └── 📂 dvirtos-default/
│   │                   ├── 🎨 cursor.css
│   │                   └── 🎨 window.css
│   ├── 📜 .htaccess                                # Regras de roteamento do servidor
│   └── 🖼️ logo-dognew-white-gold.svg               # Logo principal
│
├── 📂 src/ (Código-Fonte e Lógica do Sistema)
│   ├── 📂 apps/ (Camada 5: Espaço do Usuário / Binários Virtuais)
│   │   ├── 📂 terminal/
│   │   │   └── ⚛️  TerminalTest.tsx                # Exemplo de aplicação de terminal
│   │   ├── 📂 settings/
│   │   │   └── ⚛️ DesktopSettings.tsx              # Configurações e Customização do Desktop
│   │   └── 📂 welcome/
│   │       └── ⚛️ WelcomeApp.tsx                   # Manifesto do Desenvolvedor / App de Boas-vindas
│   │
│   ├── 📂 assets/
│   │   ├── 📂 fonts/                                # Arquivos de fontes locais (Atari, Ubuntu)
│   │   │   └── 🆎 eightbit-atari-90.ttf
│   │   └── 🖼️ react.svg
│   │
│   ├── 📂 boot/ (Camada 1: Subsistema de Boot)
│   │   ├── 📂 bios/                        # Firmware e Gerenciamento de Dispositivos
│   │   │   ├── ⚛️ BiosScreen.tsx           # Tela de POST (Power-On Self-Test)
│   │   │   ├── ⚛️ BiosSetup.tsx            # Configurações de Hardware (DEL)
│   │   │   ├── ⚛️ BootError.tsx            # Erro de Dispositivo de Boot não encontrado
│   │   │   ├── ⚛️ BootMenu.tsx             # Seleção de Dispositivo de Boot (F12)
│   │   │   └── ⚛️ ExitModal.tsx            # Confirmação de Saída do Firmware
│   │   ├── 📂 grub/                        # Lógica do Bootloader
│   │   │   ├── ⚛️ GrubBackground.tsx       # Fundo Dinâmico Dourado (SVG e Filtros)
│   │   │   └── ⚛️ GrubScreen.tsx           # Interface de Seleção de SO (Inspiração GRUB)
│   │   ├── 📂 login/               
│   │   │   └── ⚛️ LoginScreen.tsx          # Gerenciador de Exibição (Autenticação de Usuário)
│   │   └── 📂 plymouth/            
│   │       └── ⚛️ PlymouthScreen.tsx       # Tela de Splash (Animação de Carga do Kernel)
│   │
│   ├── 📂 context/
│   │   └── ⚙️ SessionContext.tsx           # Contexto Global do React (Barramento de Estado)
│   │
│   ├── 📂 hooks/                           # Abstrações de interação com Hardware e UI
│   │   ├── 📜 useAdminKeys.ts              # Ouvinte global para acesso administrativo (Ctrl+Alt+S)
│   │   ├── 📜 useHardware.ts               # Coletor de specs com fallback para BIOS/CPU/RAM
│   │   └── 📜 useWindowInteractions.ts     # Motor unificado para arrastar, redimensionar e maximizar janelas
│   │
│   ├── 📂 kernel/ (Camada 0-3: O Motor do Sistema)
│   │   ├── ⚙️ SessionManager.tsx           # Orquestra o ciclo de vida global do sistema
│   │   ├── ⚙️ WindowManager.tsx            # Gerenciamento de empilhamento e instâncias de janelas
│   │   └── ⚙️ XServer.tsx                  # Servidor de exibição simulado e máscara de entrada
│   │
│   ├── 📂 shell/ (Camada 4: Ambiente de Interface do Usuário)
│   │   ├── ⚛️ DesktopShell.tsx             # O Orquestrador (Pai) - Gerencia o ambiente
│   │   ├── 📂 panel/                       # Subsistema do Painel Principal (Barra de Contêiner)
│   │   │   ├── 📂 systray/                 # Bandeja do Sistema (Área de Notificação)
│   │   │   │   └── 📂 applets/             # Pequenos apps de status do sistema
│   │   │   │       ├── 🧩 BatteryApplet.tsx
│   │   │   │       ├── 🧩 ClockApplet.tsx
│   │   │   │       ├── 🧩 NetworkApplet.tsx
│   │   │   │       └── 🧩 VolumeApplet.tsx
│   │   │   ├── 📂 taskbar/                 # Área da lista de janelas abertas
│   │   │   └── ⚛️ StartMenu.tsx            # Lançador de Aplicativos (Menu Iniciar)
│   │   └── 📂 workspace/                   # Subsistema da Área de Trabalho (Ícones)
│   │       └── 🧩 DesktopIcon.tsx
│   │
│   ├── 📂 system/ (D-VirtUI Toolkit: Bibliotecas do Sistema)
│   │   ├── 📂 admin/                       # Backdoor Administrativo e Depuração
│   │   │   ├── 📂 painel/                  # Componentes de interface
│   │   │   │   └── ⚙️ SessionInspector.tsx # Monitor do barramento do Kernel e controle de camadas
│   │   │   └── ⚙️ AdminShell.tsx           # UI Admin Principal com Spawner de Binários (/usr/bin)
│   │   ├── 📂 controls/                    # Controles de UI Padrão (DLLs do Toolkit)
│   │   │   └── (Futuro: 🧩 SysButton.tsx, 🧩 SysInput.tsx)
│   │   ├── 📂 utils/                       # Utilitários comuns do sistema
│   │   │   └── ⚙️ BootTimer.tsx            # Lógica de contagem regressiva para sequências de auto-boot
│   │   └── 📂 window/
│   │       └── 🧩 Window.tsx               # Decoração e lógica base de janelas
│   │
│   ├── 🎨 App.css                          # Estilos principais da aplicação
│   ├── ⚛️ App.tsx                          # Componente Raiz do Sistema
│   ├── 🎨 index.css                        # Tailwind global e CSS Base
│   ├── 📜 main.tsx                         # Ponto de entrada React DOM
│   └── 📜 vite-env.d.ts                    # Definições de tipo de ambiente do Vite
│
└── 📂 dist/ (Build Final Otimizado para Deploy)    # Saída final para implantação em host remoto
```

### 🧩 Matriz de Responsabilidade das Camadas do Sistema

| Camada | Componente | Responsabilidade |
| :--- | :--- | :--- |
| **0** | SessionManager | Orquestração do estado global, simulação de hardware e persistência. |
| **1** | XServer | Simulação do servidor de exibição, mascaramento de entrada e canvas pontilhado (stippled). |
| **3** | WindowManager | Gerenciamento do ciclo de vida das janelas, empilhamento (z-index) e geometria. |
| **4** | DesktopShell | Ambiente do shell da UI, Barra de Tarefas, Menu Iniciar e Grade do Desktop. |
| **5** | UserSpace | Aplicações virtuais finais (Terminal, Configurações, Welcome App). |