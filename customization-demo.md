# Sistema de Personalização do App - Plan de Vitalidad

## 📱 Funcionalidades Implementadas

### 1. Identidade Visual
- **Nome do App**: Campo para customizar o nome exibido na instalação PWA
- **Upload de Logotipo**: PNG transparente, máximo 2MB
- **Ícone PWA**: 512x512px para instalação do app
- **Splash Screen**: Imagem opcional para tela de carregamento

### 2. Paleta de Cores
- **Cor Principal**: Botões, destaques e elementos principais
- **Cor Secundária**: Textos secundários e ícones
- **Cor de Fundo**: Fundo geral do aplicativo
- **Cor dos Títulos**: Cabeçalhos e títulos principais
- **Botão Restaurar Padrão**: Volta às cores originais do Plan de Vitalidad

### 3. Estilo dos Elementos
- **Fontes Disponíveis**:
  - Inter (Padrão)
  - Poppins
  - Roboto
  - Open Sans
  - Lato
  - Montserrat
- **Estilos de Botões**:
  - Arredondados (padrão)
  - Retos
  - Com sombra
- **Animações**: Toggle para ativar/desativar transições suaves

### 4. Layout da Home
- **Estilo Cards**: Banners e seções em cards (padrão)
- **Estilo Lista**: Ícones verticais em lista
- **Estilo Grade**: Mosaico de blocos

### 5. Idioma Principal
- **Español** (padrão)
- **Português**
- **English**

### 6. Preview em Tempo Real
- **Visualização Mobile/Tablet**: Toggle entre dispositivos
- **Atualização Instantânea**: Mudanças refletidas imediatamente
- **Preview Completo**: Simula a aparência real do app

## 🛠️ Arquivos Criados

### HTML
- `admin-dashboard.html` (modificado): Interface completa integrada

### CSS
- `customization-styles.css`: 1000+ linhas de estilos modernos e responsivos

### JavaScript
- `customization-management.js`: 800+ linhas de funcionalidade completa

## 📊 Estatísticas do Sistema

### Interface
- **4 Cards de Status**: Tema, Layout, Idioma, Última Alteração
- **6 Seções de Configuração**: Organizadas em abas intuitivas
- **Preview Interativo**: Atualização em tempo real
- **Responsivo**: Funciona perfeitamente em mobile e desktop

### Funcionalidades
- **Upload de Arquivos**: Drag & drop com validação
- **Seletor de Cores**: Input visual + texto para precisão
- **Preview de Fontes**: Visualização imediata das mudanças
- **Persistência**: Configurações salvas em localStorage
- **Exportação**: Geração de CSS e configurações para PWA

## 🎨 Exemplos de Uso

### Personalização Básica
```javascript
// Configurações padrão
{
    appName: 'Plan de Vitalidad',
    primaryColor: '#10B981',
    secondaryColor: '#6B7280',
    backgroundColor: '#F9FAFB',
    titleColor: '#1F2937',
    fontFamily: 'Inter',
    buttonStyle: 'rounded',
    enableAnimations: true,
    homeLayout: 'cards',
    primaryLanguage: 'es'
}
```

### Personalização Avançada
```javascript
// Exemplo de configuração personalizada
{
    appName: 'Mi App de Salud',
    primaryColor: '#8B5CF6',
    secondaryColor: '#6B7280',
    backgroundColor: '#F8FAFC',
    titleColor: '#1E293B',
    fontFamily: 'Poppins',
    buttonStyle: 'shadow',
    enableAnimations: true,
    homeLayout: 'grid',
    primaryLanguage: 'pt'
}
```

## 🚀 Como Usar

1. **Acesse a Aba**: Clique em "Personalização do App" no menu lateral
2. **Configure a Identidade**: Adicione nome, logo, ícone e splash screen
3. **Escolha as Cores**: Use os seletores de cor ou digite códigos hex
4. **Selecione a Fonte**: Escolha entre 6 opções disponíveis
5. **Defina o Layout**: Selecione entre cards, lista ou grade
6. **Configure o Idioma**: Escolha o idioma padrão do app
7. **Visualize**: Use o preview para ver as mudanças em tempo real
8. **Salve**: Clique em "Salvar Personalização"

## 📱 Integração PWA

O sistema gera automaticamente:
- **manifest.json**: Com nome, ícones e cores do app
- **CSS Customizado**: Variáveis CSS para aplicação no app
- **Configurações de Tema**: Para aplicação em tempo real

## 🎯 Benefícios

- **Identidade Única**: Cada instalação pode ter sua própria identidade visual
- **Experiência Personalizada**: Layout e cores adaptados ao público-alvo
- **Profissionalismo**: Interface moderna e intuitiva
- **Flexibilidade**: Fácil alteração sem conhecimento técnico
- **Performance**: Otimizado para carregamento rápido

## 🔧 Tecnologias Utilizadas

- **HTML5**: Estrutura semântica e acessível
- **CSS3**: Grid, Flexbox, CSS Variables, Animações
- **JavaScript ES6+**: Classes, Async/Await, Modules
- **LocalStorage**: Persistência de dados
- **FileReader API**: Upload e preview de imagens
- **CSS Custom Properties**: Aplicação dinâmica de temas

## ✨ Recursos Especiais

- **Drag & Drop**: Upload intuitivo de imagens
- **Validação Avançada**: Tipos e tamanhos de arquivo
- **Preview Responsivo**: Mobile e tablet
- **Notificações**: Feedback visual das ações
- **Acessibilidade**: Suporte a leitores de tela
- **Performance**: Carregamento otimizado de fontes

---

**Plan de Vitalidad** - Sistema completo de personalização de aplicativos PWA