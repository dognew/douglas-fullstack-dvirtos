# 🧩 D-VirtOS Memory Game (Engine v1.1.5)

Módulo de entretenimento lógico desenvolvido para validar a implementação de layouts dinâmicos no ecossistema D-VirtOS.

## 🛠 Especificações Técnicas
* **Arquitetura**: Componente Funcional React com Hooks de estado (`useState`, `useEffect`).
* **Layout**: Grid 8x8 (64 slots) processado via Tailwind CSS com proporção `aspect-square`.
* **Assets**: Biblioteca nativa `bootstrap-icons`.
* **Engine de Janela**: Renderizado via `Window.tsx` com `layout="flex"` e `direction="flex-col"`.

## 🧠 Mecânicas de Jogo
* **Fisher-Yates Shuffle**: Algoritmo de embaralhamento aplicado ao pool de 32 pares de ícones na inicialização.
* **Pontuação Condicional**:
    * **Match**: +1 ponto.
    * **Mismatch**: -1 ponto.
* **Estado de Finalização**: Modal reativo com ícones dinâmicos (`bi-trophy-fill` ou `bi-emoji-frown-fill`) baseados no Score final.

## ⚡ Debug & QA (Atalhos de Teclado)
Para agilizar a validação de layouts e modais sem a necessidade de completar o gameplay manual:
* **`Shift + V`**: Força estado de **Vitória** imediata (Score: 100).
* **`Shift + G`**: Força estado de **Derrota** imediata (Score: -10).