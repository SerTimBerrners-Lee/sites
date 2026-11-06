import{R as r,j as o,a as d,A as s}from"./App-l5oS9J-e.js";const l=`:root {
  font-family: "Inter Variable", Inter, Arial, sans-serif;
  color: #262a38;
  background: #f8f9fd;
  font-synthesis: none;
  font-weight: 400;
  --brand: #77a6ff;
  --brand-border: #9cbeff;
  --tint: #d6e4ff;
  --surface: #f8f9fd;
  --heading: #373d51;
  --error: #f42c2b;
  --container: 1320px;
  --gutter: 60px;
}
* {
  box-sizing: border-box;
}
html {
  scroll-behavior: smooth;
  scroll-padding-top: 90px;
}
body {
  margin: 0;
  min-width: 320px;
}
button,
input,
a {
  -webkit-tap-highlight-color: transparent;
}
button,
input {
  font: inherit;
}
button,
a {
  touch-action: manipulation;
}
button {
  cursor: pointer;
}
a {
  color: inherit;
  text-decoration: none;
}
button {
  color: inherit;
}
img {
  display: block;
  max-width: 100%;
  height: auto;
}
.brand-icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  background-color: var(--brand);
  -webkit-mask: var(--icon-source) center / contain no-repeat;
  mask: var(--icon-source) center / contain no-repeat;
}
.brand-icon > img {
  width: 100%;
  height: 100%;
  opacity: 0;
}
h1,
h2,
h3,
h4,
p,
blockquote {
  margin: 0;
}
h1,
h2,
h3,
h4 {
  font-weight: 700;
}
h2 {
  font-size: 40px;
  line-height: 1.2;
  color: var(--heading);
}
h3 {
  font-size: 24px;
  line-height: 1.25;
}
p {
  line-height: 1.4;
}
ul,
ol {
  padding: 0;
  margin: 0;
}
section[id],
footer[id] {
  scroll-margin-top: 90px;
}
.container {
  width: min(calc(100% - var(--gutter) * 2), var(--container));
  margin-inline: auto;
}
.section {
  padding-block: 80px;
}
.lead {
  font-size: 24px;
  line-height: 1.22;
}
.brand-heading,
h1 span,
.ai-heading h2 span {
  color: var(--brand);
}
.eyebrow {
  font-size: 20px;
  font-weight: 700;
  color: var(--brand);
  line-height: 1.25;
}
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 50px;
  padding: 14px 20px;
  border: 1px solid transparent;
  border-radius: 5px;
  background: var(--brand);
  color: white;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  transition:
    background 0.18s,
    box-shadow 0.18s,
    transform 0.18s;
}
.button:hover {
  background: #6395f4;
  box-shadow: 0 5px 18px #77a6ff35;
}
.button:active {
  transform: translateY(1px);
}
.button-secondary {
  background: var(--surface);
  color: var(--brand);
  font-weight: 400;
}
.button-secondary:hover,
.button-secondary:active {
  background: #ecf3ff;
  box-shadow: none;
}
.button-large {
  min-height: 70px;
  padding: 20px 25px;
  border-radius: 10px;
  font-size: 20px;
  font-weight: 600;
}
:focus-visible {
  outline: 3px solid #3d75dc;
  outline-offset: 5px;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}
.skip-link {
  position: fixed;
  z-index: 100;
  top: 8px;
  left: 12px;
  padding: 12px;
  background: white;
  border: 2px solid var(--brand);
  transform: translateY(-160%);
}
.skip-link:focus {
  transform: translateY(0);
}
.site-header {
  position: sticky;
  top: 0;
  z-index: 30;
  height: 70px;
  background: rgb(255 255 255 / 80%);
  backdrop-filter: blur(20px) saturate(130%);
  -webkit-backdrop-filter: blur(20px) saturate(130%);
  border-bottom: 1px solid #e7ecf333;
}
.header-inner {
  max-width: 1440px;
  height: 70px;
  margin: auto;
  padding: 15px var(--gutter);
  display: flex;
  align-items: center;
  gap: 32px;
}
.logo {
  display: block;
  flex-shrink: 0;
  width: 165px;
}
.logo img {
  width: 100%;
  height: auto;
}
.desktop-nav {
  display: flex;
  align-items: center;
  gap: 20px;
  white-space: nowrap;
  margin-right: auto;
}
.desktop-nav a {
  font-size: 16px;
  font-weight: 600;
  transition: color 0.2s;
}
.desktop-nav a:hover,
.footer a:hover {
  color: var(--brand);
}
.header-phone {
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  font-size: 18px;
  font-weight: 600;
  color: var(--heading);
}
.header-phone img {
  height: 24px;
  width: 24px;
}
.header-logo-mobile,
.header-phone-mobile {
  display: none;
}
.header-demo {
  font-size: 14px;
  min-height: 40px;
  padding: 10px 13px;
  white-space: nowrap;
}
.menu-toggle,
.mobile-menu {
  display: none;
}
.hero {
  position: relative;
  padding-top: 120px;
  padding-bottom: 80px;
  isolation: isolate;
  overflow: hidden;
}
.hero::before {
  content: "";
  position: absolute;
  z-index: -1;
  inset: 0;
  background: url("/figma/hero-glow.svg") center / cover no-repeat;
  mask-image: linear-gradient(#000 calc(100% - 160px), transparent);
  pointer-events: none;
}
.hero-copy h1 {
  max-width: 910px;
  font-size: 40px;
  line-height: 1.2;
}
.hero-copy .lead {
  margin-top: 20px;
}
.hero-copy .button {
  margin-top: 40px;
}
.hero-preview {
  border: 0;
  background: transparent;
  padding: 0;
  width: 100%;
  margin: 80px auto 0;
  display: block;
  text-align: left;
}
.hero-preview > img {
  width: 100%;
  aspect-ratio: 1440/593;
  object-fit: cover;
}
.audience {
  padding-top: 40px;
}
.audience .lead {
  margin-top: 20px;
  color: #101010;
}
.audience-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 30px;
  margin-top: 40px;
}
.audience-card {
  border: 1px solid var(--brand-border);
  border-radius: 20px;
  background: white;
  padding: 20px;
  min-height: 480px;
  transition: transform 0.25s ease;
}
.audience-card > img {
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-radius: 10px;
}
.audience-card h3 {
  white-space: pre-line;
  overflow-wrap: break-word;
  margin-top: 24px;
  min-height: 60px;
}
.audience-card p {
  margin-top: 15px;
  font-size: 20px;
  line-height: 1.2;
}
.modules-section {
  position: relative;
  padding: 220px 0 200px;
  background: url("/figma/modules-background.svg") center / 100% 100% no-repeat;
  isolation: isolate;
  overflow: hidden;
}
.modules-section > .container {
  max-width: 1280px;
}
.modules-decoration {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
}
.modules-decoration img {
  position: absolute;
  max-width: none;
}
.modules-path {
  left: 3.446%;
  top: 30.382vw;
  width: 78.555%;
  height: auto;
}
.glow-production {
  left: 0;
  top: 16.96%;
  width: 68.6%;
}
.glow-blue {
  left: 1.56%;
  top: 18.1%;
  width: 52.64%;
}
.glow-warehouse {
  left: 58.25%;
  top: 42.39%;
  width: 41.79%;
}
.glow-products {
  left: 0;
  top: 51.76%;
  width: 65.2%;
}
.glow-team {
  left: 24.36%;
  top: 75.54%;
  width: 75.68%;
}
.modules-more {
  display: flex;
  width: min(520px, 100%);
  margin: 60px auto 0;
  justify-content: center;
}
.modules-section .feature-list li::before {
  width: 16px;
  height: 16px;
  left: 3px;
  top: 3px;
  border-radius: 4px;
  background: white;
}
.modules-section h2 {
  text-align: center;
  position: relative;
}
.modules-list {
  display: flex;
  flex-direction: column;
  gap: 130px;
  margin-top: 70px;
  position: relative;
}
.module {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
  gap: 50px 55px;
  align-items: center;
}
.module-heading {
  display: flex;
  gap: 10px;
  align-items: center;
  grid-column: 1/-1;
  min-height: 142px;
  max-width: 820px;
}
.module-icon {
  transition: transform 0.25s ease;
  width: 142px;
  height: 142px;
  object-fit: contain;
  flex-shrink: 0;
}
.module-heading h3 {
  font-size: 32px;
  line-height: 1.22;
  margin-bottom: 20px;
}
.module-preview {
  position: relative;
  border: 0;
  padding: 0;
  background: none;
  width: 100%;
  border-radius: 10px;
  transition: transform 0.2s;
}
.module-preview > img {
  width: 100%;
  height: auto;
  filter: drop-shadow(0 12px 24px #406bb21a);
}
.preview-label {
  position: absolute;
  bottom: 14px;
  right: 14px;
  font-size: 13px;
  background: white;
  padding: 8px 12px;
  border: 1px solid var(--brand-border);
  border-radius: 5px;
  opacity: 0;
  transition: opacity 0.2s;
}
.module-preview:hover .preview-label,
.module-preview:focus-visible .preview-label {
  opacity: 1;
}
.feature-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  list-style: none;
  font-size: 20px;
  line-height: 1.2;
}
.feature-list li {
  position: relative;
  padding-left: 33px;
}
.feature-list li::before {
  content: "";
  width: 7px;
  height: 7px;
  position: absolute;
  top: 8px;
  left: 10px;
  background: var(--brand);
  transform: rotate(45deg);
}
.module.reverse {
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
  column-gap: 55px;
  row-gap: 20px;
  align-items: start;
}
.module.reverse .module-heading {
  grid-column: 1;
  grid-row: 1;
  max-width: none;
}
.module.reverse .feature-list {
  grid-column: 1;
  grid-row: 2;
  margin-left: 152px;
}
.module.reverse .module-preview {
  grid-column: 2;
  grid-row: 1/3;
  width: calc(100% + 60px);
  align-self: center;
}
.module-warehouse {
  min-height: 484px;
}
.module-team {
  min-height: 545px;
}
.module-products .module-preview {
  min-height: 410px;
  display: flex;
  align-items: center;
}
.module-production .module-preview {
  min-height: 414px;
  display: flex;
  align-items: center;
}
.ai-section {
  position: relative;
  overflow: hidden;
}
.ai-section > .container {
  max-width: 1320px;
}
.ai-heading {
  position: relative;
  text-align: center;
  padding-top: 250px;
  min-height: 410px;
}
.ai-orb {
  --orb-size: 225px;
  position: absolute;
  top: -30px;
  left: 50%;
  width: var(--orb-size);
  height: var(--orb-size);
  object-fit: contain;
  transform: translateX(-50%);
  transition: transform 0.25s ease;
  background:
    url("/figma/ai-imgSheen.svg") center / 65% auto no-repeat,
    url("/figma/ai-imgShellBrand.svg") center
      calc(50% + var(--orb-size) * 0.05) / 102% auto no-repeat,
    url("/figma/ai-imgHaloAmbient.svg") center / 102% auto no-repeat;
}
.ai-orb picture {
  position: absolute;
  width: 64%;
  aspect-ratio: 1;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.ai-robot {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.lightning {
  position: absolute;
  object-fit: contain;
  pointer-events: none;
}
.lightning-left {
  top: 70px;
  left: 5%;
  width: 180px;
  height: 180px;
  opacity: 0.4;
}
.lightning-right {
  top: 140px;
  right: 6%;
  width: 110px;
  height: 110px;
  opacity: 0.2;
}
.ai-heading .lead {
  margin-top: 20px;
}
.ai-layout {
  display: grid;
  grid-template-columns: minmax(0, 862fr) minmax(0, 428fr);
  gap: 30px;
  align-items: center;
  margin-top: 40px;
}
.chat-window {
  border: 1px solid var(--brand-border);
  border-radius: 20px;
  overflow: hidden;
  background: #f8f9fd;
  min-width: 0;
}
.chat-window-header {
  background: white;
  min-height: 56px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 15px;
  font-size: 16px;
}
.chat-window-header > img {
  width: 40px;
  height: 40px;
  object-fit: contain;
}
.chat-tools {
  display: flex;
  gap: 20px;
  margin-left: auto;
}
.chat-tools img {
  width: 24px;
  height: 24px;
}
.chat-messages {
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  min-height: 310px;
  overflow: visible;
  font-size: 14px;
  line-height: 1.25;
  scrollbar-width: thin;
}
.chat-reply {
  width: 100%;
  flex-shrink: 0;
}
.chat-reply-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}
.reply-question,
.reply-answer {
  animation: reply-appear 360ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
.reply-answer {
  animation-delay: 120ms;
}
@keyframes reply-appear {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.today {
  font-size: 12px;
  color: white;
  background: #636b77;
  border-radius: 10px;
  padding: 2px 10px;
  align-self: center;
}
.bubble {
  padding: 13px 15px 10px;
  max-width: 85%;
  border-radius: 20px;
  position: relative;
}
.outgoing {
  align-self: flex-end;
  background: #d6e4ff;
  border-bottom-right-radius: 0;
}
.incoming {
  background: white;
  border-bottom-left-radius: 0;
}
.bubble small {
  font-size: 10px;
  color: #757d8a;
  display: block;
  text-align: right;
  margin-top: 2px;
}
.bubble small span {
  color: #407bff;
}
.text-link {
  color: #407bff;
  text-decoration: underline;
}
.chat-input-preview {
  margin: 0 15px 15px;
  background: white;
  border: 1px solid #e7e7e7;
  border-radius: 20px;
  padding: 16px;
  color: #757d8a;
  font-size: 16px;
}
.chat-input-preview > div {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 18px;
}
.chat-input-preview img {
  width: 16px;
  height: 16px;
  object-fit: contain;
}
.chat-input-preview .permission,
.chat-input-preview .quick {
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 13px;
  color: var(--brand);
}
.chat-input-preview .quick {
  margin-left: auto;
}
.ai-examples {
  text-align: center;
}
.ai-examples h3 {
  font-size: 24px;
  font-weight: 600;
  line-height: 1.22;
  margin-bottom: 30px;
  color: var(--heading);
}
.assistant-card {
  background: white;
  padding: 20px 15px 25px;
  border: 1px solid var(--brand-border);
  border-radius: 20px;
  max-width: 353px;
  margin: auto;
}
.assistant-avatar {
  width: 80px;
  height: 80px;
  object-fit: contain;
  margin: 0 auto 10px;
}
.assistant-card h4 {
  font-size: 20px;
  line-height: 1.25;
}
.prompt-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  margin-top: 35px;
}
.prompt-buttons button {
  display: flex;
  align-items: center;
  gap: 10px;
  background: white;
  border: 1px solid var(--brand-border);
  padding: 10px 13px;
  border-radius: 5px;
  font-size: 14px;
  transition: background 0.2s;
}
.prompt-buttons button img {
  width: 16px;
  height: 16px;
}
.prompt-buttons button:hover,
.prompt-buttons button.selected {
  background: #edf3ff;
}
.chat-section {
  position: relative;
  padding-block: 80px;
  overflow: hidden;
}
.chat-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  min-height: 760px;
  align-items: center;
}
.chat-copy {
  position: relative;
  z-index: 2;
}
.chat-copy h2 {
  margin-top: 25px;
  line-height: 1.25;
}
.chat-features {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 25px;
  margin-block: 45px;
  max-width: 520px;
}
.chat-features li {
  transition: transform 0.25s ease;
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 20px 25px;
  background: white;
  border-radius: 35px;
  box-shadow: 0 4px 9.8px #0000000d;
  font-size: 20px;
  font-weight: 600;
  min-height: 70px;
  color: var(--heading);
}
.chat-features .brand-icon {
  height: 30px;
  width: 30px;
  object-fit: contain;
  flex-shrink: 0;
}
.chat-visual {
  position: relative;
  align-self: stretch;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  isolation: isolate;
}
.chat-visual::before {
  content: "";
  position: absolute;
  z-index: -1;
  inset: -30px -200px -30px -200px;
  background: radial-gradient(ellipse, #cbdcffb3, transparent 70%);
}
.phone-mockup {
  width: min(100%, 520px);
  height: auto;
  object-fit: contain;
  z-index: 1;
}
.chat-bubbles {
  position: absolute;
  left: -140px;
  top: 33%;
  width: 250px;
  height: 250px;
  object-fit: contain;
  opacity: 0.4;
}
.advantages-wrap {
  background: var(--tint);
}
.demo-section {
  position: relative;
  isolation: isolate;
  padding: 80px 0;
  text-align: center;
  background: var(--tint);
}
.demo-section h2 {
  color: #262a38;
}
.demo-glows {
  position: absolute;
  inset: -230px 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
}
.demo-glows::before,
.demo-glows::after {
  content: "";
  position: absolute;
  z-index: -1;
  pointer-events: none;
  transform: translate(-50%, -50%) rotate(-90deg);
  background-position: center;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.demo-glows::before {
  width: 902.494px;
  height: 1088.49px;
  left: 73px;
  top: calc(50% + 10px);
  background-image: url("/figma/cta-glow-left.svg");
}
.demo-glows::after {
  width: 917.077px;
  height: 1043.08px;
  left: calc(100% - 144.5px);
  top: calc(50% + 28.5px);
  background-image: url("/figma/cta-glow-right.svg");
}
.demo-section > .container > p:not(.form-message) {
  font-size: 20px;
  line-height: 1.2;
  margin-top: 20px;
}
.demo-form {
  display: flex;
  gap: 15px;
  max-width: 980px;
  margin: 40px auto 0;
}
.demo-form input {
  display: block;
  min-width: 0;
  flex: 1;
  height: 56px;
  border: 1px solid #e7e7e7;
  border-radius: 12px;
  background: white;
  padding: 16px 14px;
  color: #262a38;
  font-size: 16px;
}
.demo-form input::placeholder {
  color: #a8a8a8;
}
.demo-form input[aria-invalid="true"] {
  border-color: #dc444e;
}
.demo-form .button {
  min-height: 56px;
  font-size: 16px;
  font-weight: 600;
}
.form-message {
  max-width: 980px;
  margin: 18px auto 0;
  font-size: 14px;
  min-height: 0;
  color: var(--heading);
}
.form-message:empty {
  display: none;
}
.form-message.error {
  color: #a21e36;
}
.advantages h2 {
  margin-bottom: 50px;
}
.advantages-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border: 1px solid var(--brand-border);
  border-radius: 10px;
  overflow: hidden;
  background: var(--brand-border);
  gap: 1px;
}
.advantages-grid article {
  position: relative;
  background: white;
  min-height: 273px;
  padding: 30px 24px;
}
.advantages-grid article:first-child {
  border-top-left-radius: 9px;
}
.advantages-grid article:nth-child(3) {
  border-top-right-radius: 9px;
}
.advantages-grid article:nth-child(4) {
  border-bottom-left-radius: 9px;
}
.advantages-grid article:last-child {
  border-bottom-right-radius: 9px;
}
.advantage-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--brand-border);
  width: 64px;
  height: 64px;
  border-radius: 50%;
  margin-bottom: 30px;
}
.advantage-icon img {
  width: 24px;
  height: 24px;
  object-fit: contain;
}
.advantages-grid h3 {
  margin-bottom: 25px;
}
.advantages-grid p {
  font-size: 18px;
  line-height: 1.23;
}
.comparison .lead {
  margin-top: 20px;
}
.comparison-scroll {
  margin-top: 70px;
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--brand-border) transparent;
}
.comparison table {
  border-collapse: collapse;
  width: 100%;
  text-align: left;
  font-size: 20px;
}
.comparison thead th {
  padding: 0 20px 30px;
  border-bottom: 1px solid var(--brand);
  font-weight: 700;
}
.comparison thead th:nth-child(1) {
  width: 40%;
}
.comparison thead th:nth-child(2) {
  width: 20%;
  text-align: center;
}
.comparison thead th:nth-child(3) {
  width: 40%;
  text-align: center;
}
.comparison tbody::before {
  content: "";
  display: table-row;
  height: 30px;
}
.comparison tbody tr:nth-child(odd) {
  background: #eaf1ff;
}
.comparison tbody tr {
  transition: background-color 0.2s ease;
}
.comparison tbody th {
  font-weight: 400;
  padding: 25px 20px;
  line-height: 1.3;
}
.comparison tbody td {
  padding: 20px;
  text-align: center;
  height: 80px;
}
.comparison tbody img {
  width: 36px;
  height: 36px;
  object-fit: contain;
  margin: auto;
}
.scroll-hint {
  display: none;
}
.case-section {
  background: var(--tint);
}
.case-section > .container {
  max-width: 1280px;
}
.case-section h2 {
  margin-bottom: 46px;
}
.case-grid {
  display: grid;
  grid-template-columns: minmax(0, 620fr) minmax(0, 290fr) minmax(0, 290fr);
  gap: 40px;
  grid-template-rows: auto auto;
}
.case-company {
  grid-column: 1/3;
  background: white;
  border-radius: 15px;
  padding: 30px;
}
.case-company > img {
  width: 408px;
  height: auto;
  object-fit: contain;
  object-position: left center;
  margin-bottom: 20px;
}
.case-company h3 {
  line-height: 1.23;
}
.case-quote {
  padding: 30px;
  background: white;
  border-radius: 15px;
}
.case-quote h3 {
  margin-bottom: 20px;
}
.case-quote p {
  font-size: 24px;
  line-height: 1.22;
}
.case-years {
  background: var(--brand-border);
  padding: 30px;
  border-radius: 15px;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.case-years strong,
.case-stats strong {
  display: block;
  font-size: 40px;
  line-height: 1.2;
}
.case-years strong span,
.case-stats strong span {
  display: block;
  font-size: 30px;
  line-height: 1.2;
}
.case-years p {
  font-size: 20px;
  line-height: 1.2;
  margin-top: 25px;
}
.case-stats {
  grid-column: 3;
  grid-row: 1/3;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 35px 30px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 15px #00000005;
}
.case-stats p {
  font-size: 20px;
  margin-top: 25px;
}
.steps-section {
  text-align: center;
  padding-block: 90px 110px;
}
.steps-section > .container {
  max-width: 1280px;
}
.steps-section .lead {
  margin-top: 30px;
  font-weight: 600;
}
.steps-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 40px;
  list-style: none;
  margin-top: 80px;
}
.steps-grid li {
  position: relative;
}
.step-symbol {
  position: relative;
  width: 142px;
  height: 142px;
  margin: 0 auto 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  isolation: isolate;
}
.step-symbol::before {
  content: "";
  position: absolute;
  z-index: -1;
  pointer-events: none;
  width: 252%;
  height: 217%;
  left: -83%;
  top: -65%;
  background: url("/figma/step-glow.svg") center / contain no-repeat;
}
.steps-section h2 {
  color: var(--brand);
}
.steps-grid {
  position: relative;
}
.steps-grid::before {
  content: "";
  position: absolute;
  left: 22.65%;
  top: 0;
  width: 54.7%;
  height: 87px;
  background: url("/figma/steps-img.svg") center / 100% 100% no-repeat;
  pointer-events: none;
}
.step-symbol img {
  transition: transform 0.25s ease;
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.steps-grid h3 {
  margin-bottom: 20px;
  font-weight: 600;
}
.steps-grid p {
  font-size: 18px;
  line-height: normal;
}
.pricing {
  background: #f0f5ff;
}
.pricing h2 {
  margin-bottom: 45px;
}
.pricing-grid {
  display: grid;
  grid-template-columns: minmax(0, 804fr) minmax(0, 491fr);
  gap: 25px;
}
.price-card,
.custom-card {
  background: white;
  border-radius: 20px;
  padding: 60px 40px;
  min-height: 431px;
}
.price-card .eyebrow {
  font-size: 18px;
}
.price-card h3 {
  margin-top: 20px;
  font-size: 32px;
}
.price-card .lead {
  margin-top: 20px;
  max-width: 600px;
}
.price-card .button {
  margin-top: 60px;
  min-height: 58px;
}
.price-card small {
  display: block;
  font-size: 16px;
  margin-top: 15px;
  color: #757d8a;
}
.custom-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
}
.custom-icons {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}
.custom-icons img {
  width: calc((100% - 24px) / 4);
  height: auto;
  aspect-ratio: 1;
  object-fit: contain;
}
.custom-card .lead {
  line-height: 1.22;
}
.final-demo {
  padding-block: 80px;
  min-height: 348px;
}
.footer {
  padding: 80px 0;
  background: #eaf1ff;
}
.footer-grid {
  display: grid;
  grid-template-columns: 180px 290px 290px 290px;
  justify-content: space-between;
  gap: 30px;
}
.footer .logo {
  width: 180px;
}
.footer h2 {
  font-size: 24px;
  font-weight: 400;
  margin-bottom: 20px;
  color: #262a38;
}
.footer p,
.footer a,
.footer button {
  font-size: 14px;
  line-height: 1.25;
}
.footer p + p {
  margin-top: 10px;
}
.footer address {
  font-style: normal;
}
.footer address > p {
  margin-top: 12px;
}
.document-link {
  display: block;
  border: 0;
  background: none;
  padding: 0;
  text-align: left;
  text-decoration: underline;
  cursor: pointer;
}
.document-link + .document-link {
  margin-top: 12px;
}
.document-link:hover {
  color: #467bda;
}
.contact-dot {
  color: var(--brand);
}
dialog {
  width: min(1060px, calc(100% - 32px));
  max-height: calc(100dvh - 32px);
  margin: auto;
  border: 1px solid var(--brand-border);
  border-radius: 20px;
  padding: 0;
  background: white;
  color: #262a38;
  box-shadow: 0 24px 100px #1b2c4c40;
}
dialog::backdrop {
  background: #1c294a80;
  backdrop-filter: blur(5px);
}
.modal-content {
  position: relative;
  padding: 40px;
}
.modal-content h2 {
  font-size: 30px;
  line-height: 1.3;
  padding-right: 40px;
  margin-bottom: 25px;
}
.modal-content > p {
  font-size: 18px;
  margin-block: 24px;
}
.close-button {
  position: absolute;
  top: 16px;
  right: 16px;
  border: 0;
  background: #edf3ff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 28px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.close-button:hover {
  background: var(--tint);
}
.expanded-preview {
  max-height: 60vh;
  width: 100%;
  object-fit: contain;
  border: 0;
  border-radius: 0;
}
.modal-feature-list {
  list-style: disc;
  margin: 24px 0 30px;
  padding-left: 24px;
  line-height: 1.8;
}
.pricing-grid > * {
  min-width: 0;
  overflow-wrap: anywhere;
}
.footer {
  background: #373d51;
  color: white;
}
.footer h2 {
  color: white;
}
@media (min-width: 1441px) {
  .hero-preview {
    border-radius: 12px;
    overflow: hidden;
  }
  .hero {
    padding-bottom: 80px;
  }
}
@media (max-width: 1350px) {
  :root {
    --gutter: 40px;
  }
  .header-inner {
    gap: 22px;
  }
  .desktop-nav {
    gap: 15px;
  }
  .desktop-nav a {
    font-size: 14px;
  }
  .header-phone {
    font-size: 16px;
  }
  .logo {
    width: 150px;
  }
  .header-demo {
    font-size: 12px;
  }
  .footer-grid {
    grid-template-columns: 160px repeat(3, minmax(0, 1fr));
  }
  .module-heading h3 {
    font-size: 29px;
  }
  .feature-list {
    font-size: 18px;
  }
  .module-heading .lead {
    font-size: 22px;
  }
  .module.reverse .feature-list {
    margin-left: 130px;
  }
  .module-icon {
    width: 120px;
    height: 120px;
  }
  .chat-features li {
    font-size: 18px;
  }
  .case-stats strong span {
    font-size: 25px;
  }
  .case-quote p {
    font-size: 22px;
  }
}
@media (max-width: 1100px) {
  :root {
    --gutter: 32px;
  }
  h2 {
    font-size: 34px;
  }
  .header-phone {
    margin-left: auto;
  }
  .header-demo {
    display: none;
  }
  .header-inner {
    gap: 25px;
  }
  .desktop-nav a {
    font-size: 13px;
  }
  .desktop-nav {
    gap: 14px;
  }
  .header-phone {
    font-size: 14px;
  }
  .header-phone img {
    width: 20px;
    height: 20px;
  }
  .hero {
    padding-top: 90px;
  }
  .hero-copy h1 {
    font-size: 38px;
  }
  .audience-grid {
    gap: 20px;
  }
  .audience-card {
    padding: 16px;
    min-height: 450px;
  }
  .audience-card > img {
    height: 180px;
  }
  .audience-card h3 {
    font-size: 21px;
  }
  .audience-card p {
    font-size: 18px;
  }
  .modules-section {
    padding: 150px 0;
    border-radius: 120px 120px 0 0;
  }
  .modules-list {
    gap: 100px;
  }
  .module,
  .module.reverse {
    column-gap: 32px;
  }
  .module-heading h3 {
    font-size: 26px;
  }
  .module-heading .lead {
    font-size: 20px;
  }
  .module.reverse .feature-list {
    margin-left: 0;
  }
  .module.reverse .module-preview {
    width: calc(100% + 32px);
  }
  .module-production .module-preview,
  .module-products .module-preview {
    min-height: 0;
  }
  .module-warehouse,
  .module-team {
    min-height: 400px;
  }
  .module-icon {
    width: 110px;
    height: 110px;
  }
  .ai-layout {
    grid-template-columns: minmax(0, 1.7fr) minmax(0, 1fr);
  }
  .ai-examples h3 {
    font-size: 20px;
  }
  .assistant-card h4 {
    font-size: 17px;
  }
  .prompt-buttons button {
    font-size: 12px;
    gap: 7px;
    padding: 10px;
  }
  .chat-input-preview .permission {
    display: none;
  }
  .chat-copy h2 {
    font-size: 32px;
  }
  .chat-features {
    gap: 18px;
  }
  .chat-features li {
    font-size: 16px;
    padding: 18px;
  }
  .chat-layout {
    min-height: 680px;
    gap: 20px;
  }
  .chat-bubbles {
    left: -100px;
  }
  .advantages-grid article {
    padding: 25px 20px;
  }
  .advantages-grid h3 {
    font-size: 21px;
    min-height: 52px;
  }
  .advantages-grid p {
    font-size: 16px;
  }
  .case-grid {
    gap: 25px;
    grid-template-columns: minmax(0, 1.9fr) minmax(0, 1fr) minmax(0, 1fr);
  }
  .case-company,
  .case-quote,
  .case-years,
  .case-stats {
    padding: 24px;
  }
  .case-company h3,
  .case-quote h3 {
    font-size: 21px;
  }
  .case-quote p {
    font-size: 20px;
  }
  .case-years strong,
  .case-stats strong {
    font-size: 34px;
  }
  .case-years strong span,
  .case-stats strong span {
    font-size: 23px;
  }
  .case-years p,
  .case-stats p {
    font-size: 17px;
  }
  .steps-grid {
    gap: 25px;
  }
  .steps-grid h3 {
    font-size: 22px;
  }
  .steps-grid p {
    font-size: 18px;
  }
  .price-card,
  .custom-card {
    padding: 40px 30px;
  }
  .price-card h3 {
    font-size: 27px;
  }
  .price-card .lead,
  .custom-card .lead {
    font-size: 21px;
  }
  .footer-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .footer .logo {
    grid-column: 1/-1;
  }
  .footer {
    padding-block: 60px;
  }
}
@media (max-width: 850px) {
  .desktop-nav {
    display: none;
  }
  .header-demo {
    display: inline-flex;
    margin-left: 8px;
  }
  .menu-toggle {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
    border: 1px solid #d6e4ff;
    background: #f8f9fd;
    border-radius: 8px;
    width: 44px;
    height: 44px;
    flex-shrink: 0;
    padding: 11px;
  }
  .menu-toggle span {
    display: block;
    height: 2px;
    width: 20px;
    background: var(--heading);
    transition:
      transform 0.2s,
      opacity 0.2s;
  }
  .menu-toggle.is-open span:first-child {
    transform: translateY(7px) rotate(45deg);
  }
  .menu-toggle.is-open span:nth-child(2) {
    opacity: 0;
  }
  .menu-toggle.is-open span:last-child {
    transform: translateY(-7px) rotate(-45deg);
  }
  .mobile-menu {
    position: absolute;
    top: 69px;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    gap: 0;
    padding: 16px var(--gutter) 24px;
    background: white;
    box-shadow: 0 18px 28px #263e6220;
    max-height: calc(100dvh - 70px);
    overflow: auto;
  }
  .mobile-menu > a:not(.button) {
    padding: 14px 0;
    border-bottom: 1px solid #edf1f8;
    font-size: 16px;
  }
  .mobile-menu > .button {
    margin-top: 20px;
  }
  .hero-copy h1 {
    font-size: 34px;
  }
  .lead {
    font-size: 21px;
  }
  .audience-card {
    min-height: 430px;
  }
  .audience-card h3 {
    font-size: 19px;
    min-height: 70px;
  }
  .audience-card p {
    font-size: 16px;
  }
  .audience-card > img {
    height: 150px;
  }
  .module,
  .module.reverse {
    grid-template-columns: 1fr;
    gap: 30px;
    min-height: 0;
  }
  .module-heading,
  .module.reverse .module-heading {
    grid-column: 1;
    grid-row: 1;
    max-width: none;
  }
  .module-preview,
  .module.reverse .module-preview {
    grid-column: 1;
    grid-row: 3;
    max-width: 700px;
    width: 100%;
    margin: auto;
  }
  .module .feature-list {
    grid-column: 1;
    grid-row: 2;
    margin: 0 0 0 120px;
    font-size: 18px;
  }
  .modules-list {
    gap: 100px;
  }
  .module-heading h3 {
    font-size: 28px;
  }
  .module-heading .lead {
    font-size: 21px;
  }
  .modules-section {
    padding-block: 100px;
    border-radius: 80px 80px 0 0;
  }
  .ai-heading {
    padding-top: 220px;
  }
  .ai-layout {
    grid-template-columns: 1fr;
  }
  .chat-window {
    max-width: 720px;
    width: 100%;
    margin: auto;
  }
  .ai-examples {
    margin-top: 10px;
  }
  .ai-examples h3 {
    margin-bottom: 20px;
  }
  .assistant-card {
    max-width: 100%;
    display: grid;
    grid-template-columns: 70px 1fr;
    gap: 0 15px;
    align-items: center;
    text-align: left;
    padding: 20px;
  }
  .assistant-avatar {
    grid-row: 1/3;
    width: 70px;
    height: 70px;
    margin: 0;
  }
  .assistant-card h4 {
    font-size: 20px;
  }
  .prompt-buttons {
    grid-column: 2;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    margin-top: 15px;
    gap: 8px;
  }
  .prompt-buttons button {
    font-size: 12px;
  }
  .chat-layout {
    grid-template-columns: 1fr 1fr;
    min-height: 640px;
  }
  .chat-copy h2 {
    font-size: 27px;
  }
  .chat-features li {
    font-size: 14px;
    padding: 16px 18px;
    gap: 10px;
  }
  .chat-features .brand-icon {
    width: 24px;
    height: 24px;
  }
  .chat-bubbles {
    display: none;
  }
  .advantages-wrap {
    padding-top: 80px;
  }
  .advantages-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .advantages-grid h3 {
    min-height: 0;
  }
  .demo-section h2 {
    font-size: 31px;
  }
  .demo-section > .container > p:not(.form-message) {
    font-size: 18px;
  }
  .demo-form input {
    font-size: 14px;
  }
  .demo-form .button {
    font-size: 16px;
  }
  .comparison table {
    font-size: 17px;
  }
  .comparison thead th {
    padding-inline: 14px;
  }
  .comparison tbody th {
    padding-inline: 14px;
  }
  .comparison tbody img {
    width: 30px;
    height: 30px;
  }
  .case-grid {
    grid-template-columns: minmax(0, 1.7fr) minmax(0, 1fr);
  }
  .case-company {
    grid-column: 1/-1;
  }
  .case-stats {
    grid-column: 1/-1;
    grid-row: auto;
    flex-direction: row;
    gap: 30px;
  }
  .case-stats > div {
    width: 50%;
  }
  .case-years strong span,
  .case-stats strong span {
    font-size: 25px;
  }
  .steps-grid {
    gap: 20px;
  }
  .steps-grid h3 {
    font-size: 20px;
  }
  .steps-grid p {
    font-size: 16px;
  }
  .step-symbol {
    width: 120px;
    height: 120px;
  }
  .pricing-grid {
    grid-template-columns: 1.5fr 1fr;
    gap: 20px;
  }
  .price-card,
  .custom-card {
    padding: 30px 24px;
  }
  .price-card h3 {
    font-size: 25px;
  }
  .price-card .lead,
  .custom-card .lead {
    font-size: 19px;
  }
  .price-card .button {
    font-size: 17px;
    padding: 16px;
    margin-top: 35px;
  }
  .price-card small {
    font-size: 13px;
  }
  .footer h2 {
    font-size: 21px;
  }
}
@media (max-width: 600px) {
  :root {
    --gutter: 20px;
  }
  html {
    scroll-padding-top: 80px;
  }
  h2 {
    font-size: 28px;
    line-height: 1.2;
    overflow-wrap: break-word;
  }
  h3 {
    font-size: 22px;
  }
  .section {
    padding-block: 60px;
  }
  .lead {
    font-size: 18px;
    line-height: 1.4;
  }
  .desktop-break {
    display: none;
  }
  .header-inner {
    padding: 12px 20px;
    gap: 16px;
    height: 64px;
  }
  .site-header {
    height: 64px;
  }
  .logo {
    width: 145px;
  }
  .header-phone,
  .header-demo {
    display: none;
  }
  .menu-toggle {
    margin-left: auto;
    width: 40px;
    height: 40px;
    padding: 9px;
  }
  .mobile-menu {
    top: 63px;
    max-height: calc(100dvh - 64px);
  }
  .hero {
    padding-top: 60px;
    padding-bottom: 48px;
  }
  .hero-copy h1 {
    font-size: 30px;
    line-height: 1.2;
    letter-spacing: -0.5px;
    max-width: 430px;
  }
  .hero-copy .lead {
    margin-top: 24px;
    max-width: 400px;
  }
  .hero-copy .button {
    margin-top: 30px;
    width: 100%;
    max-width: 380px;
    min-height: 54px;
  }
  .hero-preview {
    margin-top: 48px;
    min-height: 220px;
    overflow: hidden;
    border-radius: 10px;
    width: calc(100% - 40px);
    background: #d6e4ff;
  }
  .hero-preview > img {
    height: 220px;
    width: 100%;
    object-fit: cover;
    object-position: 45% top;
    aspect-ratio: auto;
  }
  .audience {
    padding-top: 12px;
  }
  .audience .lead {
    margin-top: 20px;
  }
  .audience-grid {
    grid-template-columns: 1fr;
    gap: 20px;
    margin-top: 30px;
  }
  .audience-card {
    padding: 16px;
    min-height: 0;
    border-radius: 16px;
  }
  .audience-card > img {
    height: auto;
    aspect-ratio: 1.72;
    object-fit: cover;
    border-radius: 8px;
  }
  .audience-card h3 {
    font-size: 20px;
    white-space: normal;
    min-height: 0;
    max-width: 300px;
    margin-top: 22px;
  }
  .audience-card p {
    font-size: 16px;
    line-height: 1.45;
    margin-top: 12px;
    margin-bottom: 6px;
  }
  .modules-section {
    padding-block: 64px 70px;
    border-radius: 42px 42px 0 0;
  }
  .modules-section h2 {
    text-align: center;
  }
  .modules-list {
    margin-top: 42px;
    gap: 64px;
  }
  .module,
  .module.reverse {
    gap: 24px;
  }
  .module-heading,
  .module.reverse .module-heading {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    min-height: 0;
  }
  .module-icon {
    width: 88px;
    height: 88px;
  }
  .module-heading h3 {
    font-size: 20px;
    margin-bottom: 14px;
    line-height: 1.2;
  }
  .module-heading .lead {
    font-size: 16px;
    line-height: 1.4;
  }
  .module .feature-list {
    margin: 0;
    font-size: 16px;
    line-height: 1.45;
    gap: 16px;
  }
  .feature-list li {
    padding-left: 24px;
  }
  .feature-list li::before {
    left: 3px;
    top: 8px;
    width: 6px;
    height: 6px;
  }
  .module-preview {
    border-radius: 8px;
    overflow: hidden;
  }
  .preview-label {
    position: static;
    display: block;
    opacity: 1;
    width: max-content;
    float: right;
    font-size: 11px;
    margin-top: 10px;
    padding: 6px 10px;
    background: #ffffffb3;
  }
  .ai-heading {
    padding-top: 170px;
    min-height: 0;
  }
  .ai-orb {
    --orb-size: 170px;
    top: -20px;
  }
  .lightning-left {
    width: 90px;
    height: 90px;
    left: -24px;
    top: 35px;
  }
  .lightning-right {
    width: 65px;
    height: 65px;
    right: -8px;
    top: 90px;
  }
  .ai-heading h2 {
    font-size: 28px;
    line-height: 1.25;
  }
  .ai-heading .lead {
    font-size: 18px;
    margin-top: 20px;
  }
  .ai-layout {
    gap: 30px;
    margin-top: 32px;
  }
  .chat-window-header {
    padding: 8px 12px;
    gap: 8px;
    font-size: 13px;
    min-height: 50px;
  }
  .chat-window-header > img {
    width: 30px;
    height: 30px;
  }
  .chat-tools {
    gap: 14px;
  }
  .chat-tools img {
    width: 18px;
    height: 18px;
  }
  .chat-tools img:first-child {
    display: none;
  }
  .chat-messages {
    padding: 14px 10px;
    gap: 12px;
    font-size: 12px;
    min-height: 340px;
  }
  .bubble {
    padding: 10px 12px;
    max-width: 92%;
    border-radius: 14px;
  }
  .outgoing {
    border-bottom-right-radius: 0;
  }
  .incoming {
    border-bottom-left-radius: 0;
  }
  .chat-input-preview {
    margin: 0 10px 10px;
    font-size: 13px;
    padding: 12px;
    border-radius: 14px;
  }
  .chat-input-preview > div {
    margin-top: 12px;
  }
  .chat-input-preview .quick {
    font-size: 10px;
    gap: 3px;
  }
  .chat-input-preview .quick img {
    width: 13px;
    height: 13px;
  }
  .ai-examples {
    margin-top: 0;
    order: -1;
  }
  .ai-examples h3 {
    font-size: 21px;
  }
  .assistant-card {
    display: flex;
    flex-direction: column;
    text-align: center;
    padding: 24px 15px;
    max-width: 380px;
  }
  .assistant-avatar {
    margin-bottom: 10px;
  }
  .assistant-card h4 {
    font-size: 19px;
  }
  .prompt-buttons {
    flex-direction: column;
    gap: 12px;
    margin-top: 25px;
  }
  .prompt-buttons button {
    font-size: 14px;
    padding: 12px 15px;
  }
  .chat-layout {
    display: flex;
    flex-direction: column;
    gap: 35px;
    min-height: 0;
  }
  .chat-copy {
    width: 100%;
  }
  .chat-copy h2 {
    font-size: 28px;
    margin-top: 18px;
  }
  .eyebrow {
    font-size: 16px;
  }
  .chat-features {
    gap: 14px;
    margin-block: 28px;
  }
  .chat-features li {
    padding: 17px 18px;
    font-size: 16px;
    line-height: 1.35;
    min-height: 60px;
    border-radius: 30px;
  }
  .chat-features .brand-icon {
    width: 26px;
    height: 26px;
  }
  .chat-copy > .button {
    width: 100%;
    min-height: 54px;
    font-size: 17px;
  }
  .chat-visual {
    align-self: center;
    width: 100%;
    max-width: 400px;
  }
  .phone-mockup {
    width: 100%;
    max-height: 580px;
    object-fit: contain;
  }
  .chat-visual::before {
    inset: -30px -60px;
  }
  .advantages-wrap {
    padding-top: 0;
  }
  .demo-section {
    padding: 55px 0;
  }
  .demo-section h2 {
    font-size: 28px;
  }
  .demo-section > .container > p:not(.form-message) {
    font-size: 16px;
    line-height: 1.45;
    margin-top: 18px;
  }
  .demo-form {
    flex-direction: column;
    gap: 12px;
    margin-top: 28px;
    max-width: 440px;
  }
  .demo-form input {
    flex: none;
    width: 100%;
    height: 54px;
    font-size: 16px;
  }
  .demo-form .button {
    min-height: 54px;
    font-size: 17px;
  }
  .form-message {
    font-size: 13px;
    line-height: 1.5;
    text-align: left;
  }
  .advantages h2 {
    margin-bottom: 30px;
  }
  .advantages-grid {
    grid-template-columns: 1fr;
    border-radius: 14px;
  }
  .advantages-grid article {
    padding: 26px 22px;
    min-height: 0;
  }
  .advantage-icon {
    width: 56px;
    height: 56px;
    margin-bottom: 22px;
  }
  .advantages-grid h3 {
    font-size: 20px;
    margin-bottom: 15px;
  }
  .advantages-grid p {
    font-size: 16px;
    line-height: 1.45;
  }
  .comparison .lead {
    margin-top: 20px;
    font-size: 18px;
  }
  .comparison-scroll {
    margin-top: 35px;
    margin-right: 0;
    padding-right: 0;
    overflow: visible;
  }
  .comparison table {
    min-width: 0;
    table-layout: fixed;
    font-size: 16px;
  }
  .comparison thead th {
    padding: 0 6px 18px;
    font-size: 13px;
    line-height: 1.35;
    overflow-wrap: anywhere;
  }
  .comparison thead th:nth-child(1) {
    width: 52%;
  }
  .comparison thead th:nth-child(2) {
    width: 16%;
  }
  .comparison thead th:nth-child(3) {
    width: 32%;
  }
  .comparison tbody::before {
    height: 16px;
  }
  .comparison tbody th {
    padding: 16px 8px;
    overflow-wrap: break-word;
  }
  .comparison tbody td {
    padding: 16px 2px;
    height: auto;
  }
  .comparison tbody img {
    width: 30px;
    height: 30px;
  }
  .scroll-hint {
    display: none;
    margin-top: 16px;
    font-size: 12px;
    color: #757d8a;
  }
  .case-section h2 {
    margin-bottom: 30px;
  }
  .case-grid {
    grid-template-columns: 1fr;
    gap: 18px;
  }
  .case-company {
    grid-column: 1;
  }
  .case-company,
  .case-quote,
  .case-years,
  .case-stats {
    padding: 24px;
    border-radius: 14px;
  }
  .case-company > img {
    width: 408px;
    height: auto;
    margin-bottom: 20px;
  }
  .case-company h3 {
    font-size: 20px;
    line-height: 1.4;
  }
  .case-quote p {
    font-size: 18px;
    line-height: 1.45;
  }
  .case-quote h3 {
    font-size: 21px;
    margin-bottom: 18px;
  }
  .case-years {
    flex-direction: row;
    gap: 25px;
    align-items: center;
    justify-content: flex-start;
  }
  .case-years strong {
    font-size: 44px;
  }
  .case-years strong span {
    font-size: 22px;
  }
  .case-years p {
    font-size: 17px;
    margin-top: 0;
    max-width: 220px;
  }
  .case-stats {
    grid-column: 1;
    flex-direction: column;
    gap: 32px;
  }
  .case-stats > div {
    width: 100%;
  }
  .case-stats strong {
    font-size: 38px;
  }
  .case-stats strong span {
    font-size: 23px;
  }
  .case-stats p {
    margin-top: 12px;
  }
  .steps-section {
    text-align: left;
  }
  .steps-section .lead {
    margin-top: 20px;
  }
  .steps-grid {
    grid-template-columns: 1fr;
    gap: 45px;
    margin-top: 40px;
  }
  .steps-grid li {
    padding-left: 100px;
    min-height: 120px;
  }
  .step-symbol {
    position: absolute;
    left: 0;
    top: 0;
    width: 76px;
    height: 76px;
    margin: 10px 0;
  }
  .steps-grid h3 {
    font-size: 20px;
    margin-bottom: 12px;
  }
  .steps-grid p {
    font-size: 16px;
    line-height: 1.45;
  }
  .pricing h2 {
    margin-bottom: 30px;
  }
  .pricing-grid {
    grid-template-columns: 1fr;
    gap: 18px;
  }
  .price-card,
  .custom-card {
    padding: 28px 24px;
    border-radius: 16px;
    min-height: 0;
  }
  .price-card .eyebrow {
    font-size: 14px;
  }
  .price-card h3 {
    font-size: 25px;
    margin-top: 18px;
  }
  .price-card .lead {
    font-size: 18px;
    line-height: 1.4;
    margin-top: 18px;
  }
  .price-card .button {
    width: 100%;
    font-size: 16px;
    min-height: 54px;
    margin-top: 30px;
  }
  .price-card small {
    font-size: 12px;
    line-height: 1.4;
    text-align: center;
  }
  .custom-card {
    gap: 18px;
  }
  .custom-icons {
    max-width: 360px;
    width: 100%;
    margin: auto;
  }
  .custom-card .lead {
    font-size: 18px;
    line-height: 1.4;
    text-align: center;
  }
  .final-demo {
    min-height: 0;
  }
  .footer {
    padding-block: 45px;
  }
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .footer .logo {
    grid-column: 1;
    width: 180px;
    margin-bottom: 4px;
  }
  .footer h2 {
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 16px;
  }
  .footer p,
  .footer a,
  .footer button {
    font-size: 16px;
    line-height: 1.5;
  }
  .footer p + p {
    margin-top: 10px;
  }
  .document-link + .document-link {
    margin-top: 14px;
  }
  .modal-content {
    padding: 28px 20px;
  }
  .modal-content h2 {
    font-size: 24px;
    padding-right: 30px;
  }
  .modal-content > p {
    font-size: 16px;
    line-height: 1.5;
  }
  .modal-content > .button {
    width: 100%;
    font-size: 15px;
  }
  .modal-feature-list {
    font-size: 15px;
    line-height: 1.7;
  }
  .close-button {
    width: 34px;
    height: 34px;
    top: 12px;
    right: 12px;
    font-size: 25px;
  }
  .expanded-preview {
    max-height: 50vh;
  }
}

/* Match the desktop Figma composition: 60px outer inset, separate centre
   illustration and right-hand phone, without overlap with feature pills. */
@media (min-width: 1101px) {
  .ai-section > .container,
  .chat-section > .container {
    width: min(calc(100% - 120px), 1320px);
  }
  .chat-layout {
    display: block;
    position: relative;
    min-height: 0;
    container-type: inline-size;
  }
  .chat-copy {
    min-height: 57.576cqw;
  }
  .chat-copy {
    width: 64.17%;
  }
  .chat-copy h2 {
    font-size: clamp(30px, 3.03cqw, 40px);
  }
  .chat-features {
    width: 59.27%;
    max-width: none;
    gap: clamp(18px, 1.894cqw, 25px);
    margin-block: clamp(32px, 3.409cqw, 45px);
  }
  .chat-features li {
    font-size: clamp(15px, 1.515cqw, 20px);
    padding: clamp(15px, 1.515cqw, 20px) clamp(18px, 1.894cqw, 25px);
    min-height: clamp(56px, 5.303cqw, 70px);
    gap: clamp(9px, 0.909cqw, 12px);
  }
  .chat-features .brand-icon {
    width: clamp(24px, 2.273cqw, 30px);
    height: clamp(24px, 2.273cqw, 30px);
  }
  .chat-visual {
    position: absolute;
    inset: 0;
    display: block;
    pointer-events: none;
  }
  .phone-mockup {
    position: absolute;
    left: 60.68%;
    top: 2.803cqw;
    width: 39.39%;
    height: auto;
    max-height: none;
  }
  .chat-bubbles {
    left: 41.89%;
    top: 22.197cqw;
    width: 250px;
    height: 250px;
  }
  .chat-visual::before {
    inset: -9px -100px -74px 50%;
  }
}
@media (max-width: 360px) {
  :root {
    --gutter: 16px;
  }
  .hero-copy h1 {
    font-size: 27px;
  }
  .hero-preview {
    width: calc(100% - 32px);
  }
  h2 {
    font-size: 26px;
  }
  .chat-features li {
    font-size: 14px;
    padding: 15px;
  }
  .steps-grid li {
    padding-left: 88px;
  }
  .assistant-card h4 {
    font-size: 18px;
  }
  .header-inner {
    padding-inline: 16px;
  }
}
/* Desktop composition follows the original 1440px Figma canvas. Typography
   and geometry scale together until the content switches to the stacked layout. */
@media (min-width: 1101px) {
  .modules-section {
    container-type: inline-size;
    width: 100%;
    max-width: none;
    height: 212.708vw;
    padding: 0;
    border-radius: 0;
    margin-inline: auto;
  }
  .modules-section > .container {
    width: 100%;
    max-width: none;
    height: 100%;
    position: relative;
  }
  /* Keep the glows inside the same silhouette as the blue backing, so they
     cannot leave a straight strip below its rounded bottom edge. */
  .modules-decoration {
    mask: url("/figma/modules-background.svg") center / 100% 100% no-repeat;
  }
  .modules-section h2 {
    position: absolute;
    top: 15.278cqw;
    width: 100%;
    font-size: 2.778cqw;
  }
  .modules-list {
    position: absolute;
    inset: 0;
    margin: 0;
    display: block;
  }
  .module,
  .module.reverse {
    position: absolute;
    left: 0;
    width: 100%;
    display: block;
    min-height: 0;
    height: 42cqw;
  }
  .module-production {
    top: 23.542cqw;
  }
  .module-warehouse {
    top: 73.819cqw;
  }
  .module-products {
    top: 116.528cqw;
  }
  .module-team {
    top: 168.889cqw;
  }
  .module .module-heading {
    position: absolute;
    top: 0;
    left: 5.556cqw;
    width: 50.565cqw;
    max-width: none;
    min-height: 0;
    height: 9.87cqw;
    gap: 0.694cqw;
  }
  .module .module-icon {
    width: 9.87cqw;
    height: 9.87cqw;
  }
  .module-heading > div {
    width: 40cqw;
    flex-shrink: 0;
  }
  .module .module-heading h3 {
    font-size: 2.222cqw;
    line-height: normal;
    margin-bottom: 1.389cqw;
  }
  .module .module-heading .lead {
    font-size: 1.667cqw;
    line-height: normal;
  }
  .module .module-preview {
    position: absolute;
    top: 13.403cqw;
    left: 5.556cqw;
    width: 45.903cqw;
    height: 28.75cqw;
    min-height: 0;
    display: block;
    margin: 0;
  }
  .module-preview > img {
    height: 100%;
    object-fit: contain;
    filter: none;
  }
  .module-production .module-preview > img {
    position: absolute;
    left: -1.528cqw;
    top: -1.528cqw;
    width: 48.958cqw;
    height: 31.806cqw;
    max-width: none;
  }
  .module .feature-list {
    position: absolute;
    top: 17.986cqw;
    left: 59.375cqw;
    width: 35.972cqw;
    margin: 0;
    font-size: 1.389cqw;
    line-height: normal;
    gap: 1.389cqw;
  }
  .modules-section .feature-list li {
    padding-left: 2.273cqw;
  }
  .modules-section .feature-list li::before {
    width: 1.111cqw;
    height: 1.111cqw;
    left: 0.208cqw;
    top: 0.208cqw;
    border-radius: 0.278cqw;
  }
  .module.reverse .module-heading {
    align-items: flex-start;
  }
  .module.reverse .module-heading > div {
    padding-top: 0.694cqw;
  }
  .module.reverse .module-preview {
    left: 58.472cqw;
    top: 0.694cqw;
    width: 41.528cqw;
    height: 33.611cqw;
  }
  .module.reverse .module-preview > img {
    position: absolute;
    left: -0.808cqw;
    top: -0.808cqw;
    width: 42.301cqw;
    height: 35.228cqw;
    max-width: none;
  }
  .module.reverse .feature-list {
    top: 13.194cqw;
    left: 16.12cqw;
    width: 40cqw;
    margin: 0;
  }
  .module-products .module-preview {
    width: 50.486cqw;
    height: 28.477cqw;
  }
  .module-products .feature-list {
    top: 20.694cqw;
    width: 40cqw;
  }
  .module.module-team .module-heading {
    left: 3.403cqw;
    width: 51.745cqw;
  }
  .module-team .module-heading > div {
    width: 41.18cqw;
  }
  .module.module-team .feature-list {
    top: 10.556cqw;
    left: 13.968cqw;
  }
  .module.module-team .module-preview {
    left: 58.403cqw;
    top: 0;
    height: 37.847cqw;
  }
  .module.module-team .module-preview > img {
    width: 41.528cqw;
    height: 37.847cqw;
    left: 0;
    top: 0;
  }
  .modules-more {
    position: absolute;
    bottom: 5.556cqw;
    left: 31.944cqw;
    width: 36.111cqw;
    margin: 0;
    font-size: 1.389cqw;
    min-height: 4.861cqw;
  }
}

.legal-dialog {
  width: min(720px, calc(100% - 32px));
  border: 0;
  color: var(--heading);
}
.dialog-layout {
  display: flex;
  flex-direction: column;
  height: min(868px, calc(100dvh - 32px));
}
.dialog-header {
  position: relative;
  flex-shrink: 0;
  padding: 25px 60px 25px 30px;
  border-bottom: 1px solid var(--tint);
}
.dialog-header h2 {
  font-size: 24px;
  font-weight: 600;
  line-height: 1.2;
}
.dialog-header .close-button {
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  width: 30px;
  height: 30px;
  background: none;
  border-radius: 6px;
  color: var(--heading);
}
.dialog-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 4px 30px 25px;
  overscroll-behavior: contain;
}
.legal-note {
  background: #eef3ff;
  padding: 15px 18px;
  font-size: 14px;
  line-height: 1.45;
  border-radius: 10px;
}
.legal-section {
  padding-top: 25px;
}
.legal-section h3 {
  font-size: 18px;
  font-weight: 600;
  line-height: 1.3;
  margin-bottom: 9px;
}
.legal-section p {
  font-size: 16px;
  line-height: 1.5;
}
.dialog-footer {
  flex-shrink: 0;
  padding: 16px 30px;
  border-top: 1px solid var(--tint);
  display: flex;
  justify-content: flex-end;
}
.dialog-footer .button {
  min-height: 42px;
  padding: 10px 20px;
  font-size: 16px;
}
@media (max-width: 1100px) {
  .modules-section {
    background: var(--tint);
    border-radius: 60px 60px 30px 30px;
  }
  .modules-path {
    display: none;
  }
}
@media (max-width: 600px) {
  .modules-section {
    /* Keep the desktop's three sloped lobes instead of a rectangular panel. */
    background:
      url("/figma/modules-mobile-top.svg") top / 100% 80px no-repeat,
      linear-gradient(transparent 79px, var(--tint) 79px);
    border-radius: 0 0 32px 32px;
    padding-top: 110px;
  }
  .module,
  .module.reverse {
    position: relative;
    padding-left: 24px;
  }
  .module::before {
    content: "";
    position: absolute;
    left: 0;
    top: 44px;
    bottom: -108px;
    width: 68px;
    border-top: 2px solid var(--brand);
    border-left: 2px solid var(--brand);
    border-top-left-radius: 20px;
    pointer-events: none;
    z-index: -1;
  }
  .module:last-child::before {
    bottom: auto;
    height: 0;
    border-left: 0;
    border-radius: 0;
  }
  .steps-grid::before {
    content: none;
  }
  .demo-glows::before {
    left: 0;
    width: 600px;
    height: 720px;
  }
  .demo-glows::after {
    left: 100%;
    width: 600px;
    height: 680px;
  }
  .legal-dialog {
    width: min(358px, calc(100% - 32px));
  }
  .dialog-layout {
    height: min(812px, calc(100dvh - 32px));
  }
  .dialog-header {
    padding: 22px 54px 22px 22px;
  }
  .dialog-header h2 {
    font-size: 20px;
  }
  .dialog-header .close-button {
    right: 16px;
  }
  .dialog-body {
    padding-inline: 22px;
  }
  .legal-note {
    font-size: 14px;
  }
  .legal-section {
    padding-top: 24px;
  }
  .legal-section h3 {
    font-size: 16px;
  }
  .legal-section p {
    font-size: 14px;
    line-height: 22px;
  }
  .dialog-footer {
    padding: 13px 22px;
  }
}

/* Shared form controls and dialog surfaces from the SEP design system. */
.hero-preview {
  width: 100%;
  max-width: none;
  border-radius: 0;
  background: #77a6ff26;
  box-shadow: 0 0 27.468px #00000012;
}
.lead-form {
  text-align: left;
}
.lead-form-inline {
  max-width: 980px;
  margin: 40px auto 0;
}
.lead-fields {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) 150px;
  align-items: start;
  gap: 15px;
}
.lead-field {
  min-width: 0;
}
.input-wrap {
  position: relative;
}
.lead-field input {
  width: 100%;
  height: 56px;
  min-width: 0;
  padding: 15px;
  border: 1px solid #e7e7e7;
  border-radius: 12px;
  background: white;
  color: #262a38;
  font-size: 16px;
  transition:
    border-color 0.18s,
    box-shadow 0.18s;
}
.lead-field input::placeholder {
  color: #b8b8b8;
}
.lead-field input:hover {
  border-color: #9cbeff;
}
.lead-field input:focus {
  outline: none;
  border-color: #77a6ff;
  box-shadow: 0 0 0 2px #77a6ff26;
}
.lead-field.is-invalid input {
  border-color: var(--error);
}
.lead-submit {
  width: 100%;
  min-height: 56px;
  font-weight: 600;
}
.button:disabled {
  background: #f5f5f5;
  color: #757d8a;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}
.field-tooltip {
  position: absolute;
  z-index: 5;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  width: max-content;
  max-width: min(360px, calc(100vw - 48px));
  padding: 8px 16px;
  border-radius: 8px;
  background: #262a38;
  color: white;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  pointer-events: none;
}
.field-tooltip::after {
  content: "";
  position: absolute;
  top: 100%;
  left: calc(50% - 6px);
  border: 6px solid transparent;
  border-top-color: #262a38;
}
.consent-block {
  position: relative;
  margin-top: 12px;
  animation: reveal-consent 0.2s ease-out;
}
.consent-row {
  display: flex;
  gap: 5px;
  align-items: center;
  color: #262a38;
  font-size: 12px;
  line-height: 18px;
}
.consent-row input {
  flex-shrink: 0;
  appearance: none;
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  margin: 0;
  border: 0;
  border-radius: 4.16667px;
  background: transparent url("/figma/consent-checkbox-default.svg") center / 20px 20px no-repeat;
  cursor: pointer;
}
.consent-row input:checked {
  background-image: url("/figma/consent-checkbox-checked.svg");
}
.consent-block.is-invalid input {
  border-color: var(--error);
  background-image: url("/figma/consent-checkbox-error.svg");
}
@media (forced-colors: active) {
  .consent-row input,
  .consent-row input:checked,
  .consent-block.is-invalid input {
    appearance: auto;
    -webkit-appearance: auto;
    background-image: none;
  }
}
.privacy-link {
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  text-decoration: underline;
  text-underline-offset: 2px;
}
.privacy-link:hover {
  color: #518bef;
}
.consent-error {
  position: absolute;
  z-index: 5;
  top: calc(100% + 10px);
  left: 0;
  width: max-content;
  max-width: min(360px, 100%, calc(100vw - 48px));
  padding: 8px 16px;
  margin: 0;
  border-radius: 8px;
  background: #262a38;
  color: white;
  font-size: 14px;
  line-height: 20px;
  text-align: left;
  pointer-events: none;
  animation: consent-tooltip-appear 160ms ease-out;
}
.consent-error::after {
  content: "";
  position: absolute;
  bottom: 100%;
  left: 4px;
  border: 6px solid transparent;
  border-bottom-color: #262a38;
}
.lead-form-modal .consent-error {
  top: auto;
  bottom: calc(100% + 10px);
}
.lead-form-modal .consent-error::after {
  top: 100%;
  bottom: auto;
  border-bottom-color: transparent;
  border-top-color: #262a38;
}
@keyframes consent-tooltip-appear {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  .consent-error {
    animation: none;
  }
}
.form-notification {
  padding: 10px 15px;
  margin-top: 15px;
  border: 2px solid var(--error);
  border-radius: 5px;
  color: #262a38;
  background: white;
  font-size: 14px;
  line-height: 1.45;
  box-shadow: 0 4px 5px #0000000d;
}
@keyframes reveal-consent {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
.ui-dialog {
  border: 0;
  border-radius: 20px;
  color: var(--heading);
  box-shadow: 0 0 22px #00000012;
}
.dialog-layout {
  height: auto;
  max-height: calc(100dvh - 32px);
}
.legal-dialog .dialog-layout {
  height: min(868px, calc(100dvh - 32px));
}
.dialog-header {
  padding: 25px 65px 25px 30px;
}
.dialog-header .close-button {
  width: 30px;
  height: 30px;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border-radius: 5px;
  padding: 0;
  flex-shrink: 0;
}
.dialog-header .close-button:hover {
  background: #eef3ff;
}
.close-button img {
  width: 24px;
  height: 24px;
  flex: 0 0 24px;
  object-fit: contain;
}
.dialog-body {
  padding: 25px 30px;
}
.legal-dialog .dialog-body {
  padding-top: 4px;
}
.dialog-body > p:not(.legal-note) {
  font-size: 16px;
  line-height: 1.5;
}
.preview-dialog {
  width: fit-content;
  max-width: calc(100% - 32px);
}
.preview-dialog .dialog-body {
  padding: 20px 23px 20px 30px;
}
.preview-dialog .dialog-footer {
  border-top: 0;
}
.expanded-preview {
  width: min(
    var(--preview-natural-width, 1380px),
    1380px,
    calc(100vw - 85px - var(--modal-scrollbar, 0px)),
    calc((100dvh - 230px) * var(--preview-ratio, 1))
  );
  height: auto;
  aspect-ratio: var(--preview-ratio, auto);
  max-width: min(1380px, calc(100vw - 85px - var(--modal-scrollbar, 0px)));
  max-height: calc(100dvh - 230px);
  object-fit: contain;
  margin-inline: auto;
}
.dialog-footer {
  gap: 12px;
  flex-wrap: wrap;
}
.request-dialog {
  width: min(440px, calc(100% - 32px));
}
.request-dialog .dialog-header {
  padding: 30px 60px 0 30px;
  border: 0;
}
.request-dialog .dialog-header h2 {
  font-size: 24px;
  color: #181818;
}
.request-dialog .close-button {
  top: 30px;
  right: 20px;
  transform: none;
}
.request-dialog .dialog-body {
  padding: 25px 30px 30px;
  overflow: auto;
}
.request-intro {
  color: #757d8a;
  margin-bottom: 25px;
}
.lead-form-modal .lead-fields {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.lead-form-modal .lead-field {
  width: 100%;
}
.lead-form-modal .lead-field > label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  color: #181818;
}
.lead-form-modal input:not([type="checkbox"]) {
  height: 44px;
  border-radius: 5px;
  background: #f8f9fd;
  font-size: 14px;
  border-color: transparent;
}
.lead-form-modal .lead-field input:focus {
  border-color: #9cbeff;
}
.lead-form-modal .lead-field.is-invalid input {
  border-color: var(--error);
}
.lead-form-modal .consent-block {
  margin-top: 25px;
}
.lead-form-modal .lead-submit {
  margin-top: 25px;
  min-height: 50px;
}
.lead-form-modal .form-notification {
  margin-top: 25px;
}
.lead-form-modal .field-tooltip {
  max-width: 100%;
}
.form-alternative {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 25px;
  font-size: 12px;
  color: #757d8a;
}
.form-alternative::before,
.form-alternative::after {
  content: "";
  height: 1px;
  background: #e7e7e7;
  flex: 1;
}
.form-phone {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-size: 14px;
  font-weight: 600;
  margin-top: 15px;
  color: #181818;
}
.form-phone img {
  flex-shrink: 0;
}
.form-phone > span > span {
  color: #77a6ff;
}
.chat-tools {
  gap: 5px;
}
.chat-tools img {
  box-sizing: content-box;
  padding: 8px;
  width: 24px;
  height: 24px;
}
.chat-tools img:first-child {
  width: 22px;
  height: 22px;
  opacity: 0.4;
}
.chat-input-preview > div {
  gap: 8px;
  flex-wrap: wrap;
}
.chat-input-tool,
.chat-input-preview .permission,
.chat-input-preview .quick {
  padding: 7px 8px;
  height: 30px;
  border-radius: 5px;
  background: #f8f9fd;
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
}
.chat-input-preview .permission,
.chat-input-preview .quick {
  gap: 10px;
  font-size: 14px;
  border: 0;
  max-width: 100%;
  height: auto;
  min-height: 30px;
  text-align: left;
  transition: background-color 0.2s ease;
}
.chat-input-preview .permission .brand-icon,
.chat-input-preview .quick .brand-icon {
  flex-shrink: 0;
}
.chat-input-preview .permission:hover,
.chat-input-preview .quick:hover,
.chat-input-preview button[aria-expanded="true"] {
  background: #ecf3ff;
}
.chat-setting-menu {
  position: fixed;
  inset: auto;
  margin: 0;
  padding: 10px;
  width: max-content;
  max-width: calc(100vw - 16px);
  border: 0.5px solid #e7e7e7;
  border-radius: 15px;
  background: white;
  color: #181818;
  box-shadow: 0 4px 9.8px #0000000d;
  overflow: auto;
}
.chat-setting-menu:popover-open {
  display: flex;
  flex-direction: column;
  gap: 5px;
  animation: chat-menu-appear 160ms ease-out;
}
.chat-setting-menu > button {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 35px;
  padding: 5px;
  border: 0;
  border-radius: 5px;
  background: transparent;
  text-align: left;
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
  transition: background-color 0.15s ease;
}
.chat-setting-menu > button:hover,
.chat-setting-menu > button:focus-visible,
.chat-setting-menu > button[aria-checked="true"] {
  background: #f2f7ff;
}
.chat-option-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}
.chat-option-icon img {
  width: 24px;
  height: 24px;
  object-fit: contain;
}
@keyframes chat-menu-appear {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.chat-input-tool.send-tool {
  background: #f5f5f5;
}
@media (min-width: 1441px) {
  .hero-preview {
    border-radius: 0;
  }
}
@media (max-width: 850px) {
  .dialog-header h2 {
    font-size: 22px;
  }
}
@media (max-width: 600px) {
  .hero-preview {
    width: 100%;
    border-radius: 0;
  }
  .lead-form-inline {
    margin-top: 28px;
  }
  .lead-form-inline .lead-fields {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .lead-field input {
    font-size: 16px;
  }
  .lead-form-inline .lead-submit {
    margin-top: 0;
  }
  .dialog-header {
    padding: 22px 54px 22px 22px;
  }
  .dialog-header h2 {
    font-size: 20px;
  }
  .dialog-header .close-button {
    right: 16px;
  }
  .dialog-body {
    padding: 22px;
  }
  .preview-dialog {
    width: calc(100% - 32px);
  }
  .preview-dialog .dialog-body {
    padding-inline: 22px;
  }
  .preview-dialog .expanded-preview {
    width: 100%;
    max-width: 100%;
  }
  .dialog-footer {
    padding: 13px 22px;
  }
  .dialog-footer .button {
    flex: 1;
    font-size: 14px;
  }
  .legal-dialog .dialog-layout {
    height: min(812px, calc(100dvh - 32px));
  }
  .request-dialog {
    width: min(358px, calc(100% - 32px));
  }
  .request-dialog .dialog-header {
    padding: 25px 52px 0 25px;
  }
  .request-dialog .dialog-header h2 {
    font-size: 20px;
  }
  .request-dialog .close-button {
    top: 22px;
    right: 16px;
  }
  .request-dialog .dialog-body {
    padding: 20px 25px 25px;
  }
  .request-dialog .dialog-body > .request-intro {
    font-size: 14px;
    margin-bottom: 20px;
  }
  .lead-form-modal .consent-block,
  .lead-form-modal .lead-submit {
    margin-top: 20px;
  }
  .form-phone {
    font-size: 12px;
  }
  .chat-window-header {
    gap: 8px;
    padding-inline: 10px;
  }
  .chat-tools {
    gap: 0;
  }
  .chat-tools img {
    padding: 5px;
  }
  .chat-input-preview .quick {
    font-size: 10px;
    gap: 4px;
    margin-left: auto;
  }
}

.back-to-top {
  position: fixed;
  right: max(24px, env(safe-area-inset-right));
  bottom: max(24px, env(safe-area-inset-bottom));
  z-index: 25;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 57px;
  height: 57px;
  padding: 12px;
  border: 0.5px solid #e7e7e7;
  border-radius: 75px;
  background: white;
  opacity: 0;
  visibility: hidden;
  transform: translateY(8px);
  transition:
    opacity 0.2s,
    transform 0.2s,
    visibility 0.2s;
}
.back-to-top.is-visible {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}
.back-to-top img {
  width: 32px;
  height: 32px;
}
@media (hover: hover) and (pointer: fine) {
  .audience-card:hover,
  .module-preview:hover,
  .chat-features li:hover {
    transform: scale(1.025);
  }
  .ai-orb:hover {
    transform: translateX(-50%) scale(1.08);
  }
  .module-icon:hover,
  .steps-grid li:hover .step-symbol img {
    transform: scale(1.08);
  }
  .comparison tbody tr:hover {
    background: #d6e4ff;
  }
  .back-to-top:hover {
    transform: translateY(-3px);
  }
}
@media (max-width: 600px) {
  .chat-input-preview .permission {
    font-size: 11px;
    gap: 5px;
  }
  .advantages-grid article {
    border-radius: 0;
  }
  .advantages-grid article:first-child {
    border-radius: 13px 13px 0 0;
  }
  .advantages-grid article:last-child {
    border-radius: 0 0 13px 13px;
  }
  .back-to-top {
    right: max(16px, env(safe-area-inset-right));
    bottom: max(16px, env(safe-area-inset-bottom));
  }
}
@media (min-width: 601px) and (max-width: 850px) {
  .advantages-grid article {
    border-radius: 0;
  }
  .advantages-grid article:first-child {
    border-top-left-radius: 9px;
  }
  .advantages-grid article:nth-child(2) {
    border-top-right-radius: 9px;
  }
  .advantages-grid article:nth-child(5) {
    border-bottom-left-radius: 9px;
  }
  .advantages-grid article:last-child {
    border-bottom-right-radius: 9px;
  }
}
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
  *,
  *::before,
  *::after {
    transition: none !important;
    animation: none !important;
  }
  .hero-preview,
  .module-preview,
  .audience-card,
  .module-icon,
  .step-symbol img,
  .chat-features li,
  .advantages-grid article,
  .steps-grid li,
  .back-to-top {
    transform: none !important;
  }
  .ai-orb {
    transform: translateX(-50%) !important;
  }
}

/* Mobile revision from Figma 49102:2738. Keep desktop geometry unchanged. */
.mobile-chat-back,
.mobile-chat-title,
.module-mobile-decoration,
.mobile-setting-icon {
  display: none;
}
@media (max-width: 600px) {
  .lead {
    line-height: 22px;
  }
  .hero {
    padding-bottom: 33.586px;
    overflow: clip;
  }
  .hero-copy .lead {
    margin-top: 20px;
    line-height: 22px;
  }
  .hero-copy .button {
    margin-top: 20px;
    max-width: none;
    padding-inline: 13px;
    font-size: 16px;
    font-weight: 500;
  }
  .hero-preview {
    width: 122.769%;
    max-width: none;
    margin: 54px 0 0 -8px;
    min-height: 0;
    height: 252px;
  }
  .hero-preview > img {
    height: 252px;
    object-position: center;
  }
  .audience {
    padding-top: 30px;
  }
  .audience h2 {
    font-size: 30px;
    line-height: 36px;
    letter-spacing: -0.25px;
    white-space: nowrap;
  }
  .audience .lead {
    margin-top: 20px;
  }
  .audience-grid {
    margin-top: 20px;
  }
  .audience-card {
    padding: 15px;
    border-radius: 15px;
  }
  .audience-card > img {
    aspect-ratio: 318 / 183.719;
  }
  .audience-card h3 {
    line-height: 24px;
  }
  .audience-card p {
    line-height: 19px;
  }

  .modules-section {
    padding-block: 80.172px 40px;
  }
  .modules-list {
    margin-top: 20px;
    gap: 20px;
  }
  .module,
  .module.reverse {
    position: relative;
    isolation: isolate;
    padding-left: 0;
    gap: 20px;
  }
  .modules-decoration .module-glow {
    display: none;
  }
  .module-mobile-decoration {
    display: block;
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
  }
  .module-mobile-decoration img {
    position: absolute;
    max-width: none;
    height: auto;
  }
  .module-production .mobile-module-glow {
    width: 149.714%;
    left: -20px;
    top: 312.074px;
  }
  .mobile-module-cyan {
    width: 114.857%;
    left: -8px;
    top: 390.914px;
  }
  .module-warehouse .mobile-module-glow {
    width: 101.182%;
    left: 16.01px;
    top: 313.254px;
  }
  .module-products .mobile-module-glow {
    width: 72.65%;
    left: -20px;
    top: 285px;
  }
  .module-team .mobile-module-glow {
    width: 168.571%;
    left: -34.286%;
    top: -40px;
  }
  .module::before {
    content: none;
  }
  .module .module-heading,
  .module.reverse .module-heading {
    gap: 10px;
  }
  .module-icon {
    width: 92px;
    height: 92px;
  }
  .module-heading > div {
    width: calc(100% - 24px);
  }
  .module-heading h3 {
    line-height: 24px;
  }
  .module-heading .lead {
    line-height: 19px;
  }
  .module .module-preview,
  .module.reverse .module-preview {
    grid-row: 2;
    width: 100%;
    min-height: 0;
    margin: 0;
    border-radius: 5px;
    box-shadow: 0 0 22px #00000012;
  }
  .module-preview > img {
    display: block;
    width: 100%;
    height: auto;
    max-height: none;
    object-fit: contain;
    object-position: center;
  }
  .module .feature-list,
  .module.reverse .feature-list {
    grid-row: 3;
    width: 100%;
    gap: 15px;
    line-height: 19px;
  }
  .module .feature-list li {
    min-height: 22.627px;
    padding-left: 32.627px;
    padding-right: 15px;
  }
  .module .feature-list li::before {
    left: 3.313px;
    top: 3.313px;
    width: 16px;
    height: 16px;
    border-radius: 4px;
  }
  .module-preview .preview-label {
    display: none;
  }

  .ai-layout {
    margin-top: 20px;
    gap: 20px;
  }
  .ai-heading .lead {
    line-height: 22px;
  }
  .ai-examples h3 {
    font-size: 20px;
    line-height: 24px;
    margin-bottom: 20px;
  }
  .assistant-card {
    padding: 20px 15px 25px;
  }
  .assistant-avatar {
    width: 80px;
    height: 80px;
    margin-bottom: 10px;
  }
  .assistant-card h4 {
    font-size: 20px;
    font-weight: 600;
    line-height: 24px;
  }
  .prompt-buttons {
    margin-top: 35px;
    gap: 15px;
  }
  .prompt-buttons button {
    min-height: 40px;
    padding: 10px 13px;
    line-height: 17px;
  }
  .mobile-chat-back,
  .mobile-chat-title,
  .mobile-setting-icon {
    display: block;
  }
  .desktop-chat-title,
  .desktop-setting-icon {
    display: none;
  }
  .chat-window {
    max-width: 380px;
    min-height: 714px;
    display: flex;
    flex-direction: column;
  }
  .chat-window-header {
    min-height: 51px;
    padding: 8px 4px;
    gap: 8px;
    border-bottom: 0.5px solid #e7e7e7;
    color: #181818;
  }
  .chat-window-header > img {
    width: 34px;
    height: 34px;
    flex-shrink: 0;
  }
  .chat-window-header > .mobile-chat-back {
    width: 26px;
    height: 20px;
    padding-inline: 3px;
  }
  .chat-window-header strong {
    min-width: 0;
    flex: 1;
    font-size: 11.5px;
    line-height: 14px;
  }
  .chat-window-header strong span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .chat-tools {
    flex-shrink: 0;
    margin-left: 0;
    gap: 4px;
  }
  .chat-tools img {
    box-sizing: border-box;
    width: 30px;
    height: 34px;
    padding: 7px 5px;
  }
  .chat-messages {
    flex: 1;
    min-height: 0;
    padding: 16px 8px 22px;
    font-size: 11.86px;
    line-height: 14.24px;
    gap: 8.47px;
    color: #181818;
  }
  .today {
    padding: 2px 8px;
    font-size: 10.16px;
    line-height: 13px;
  }
  .chat-messages .bubble {
    padding: 8.47px 12.7px;
    border-radius: 17px;
  }
  .chat-messages .outgoing {
    border-bottom-right-radius: 0;
  }
  .chat-messages .incoming {
    border-bottom-left-radius: 0;
  }
  .chat-input-preview {
    display: flex;
    align-items: center;
    gap: 6.776px;
    margin: 0 8px 19px;
    padding: 8.471px;
    min-height: 42.353px;
    border-width: 0.424px;
    border-radius: 25.412px;
    box-shadow: 0 0 9.3px #00000012;
    font-size: 13.55px;
    line-height: 16px;
  }
  .chat-input-preview > span {
    order: 2;
    flex: 1;
    min-width: 0;
    white-space: nowrap;
  }
  .chat-input-preview > div {
    display: contents;
  }
  .chat-input-preview .chat-input-tool:first-child {
    order: 1;
    width: 25.412px;
    height: 25.412px;
    padding: 2.5415px;
    background: transparent;
  }
  .chat-input-preview .chat-input-tool:first-child img {
    width: 20.329px;
    height: 20.329px;
  }
  .chat-input-preview .chat-input-tool:not(:first-child),
  .chat-input-preview .chat-setting-label {
    display: none;
  }
  .chat-input-preview .permission,
  .chat-input-preview .quick {
    order: 3;
    width: 25.412px;
    min-width: 25.412px;
    height: 25.412px;
    min-height: 25.412px;
    padding: 0;
    margin: 0;
    background: none;
  }
  .chat-input-preview .permission .mobile-setting-icon,
  .chat-input-preview .quick .mobile-setting-icon {
    width: 25.412px;
    height: 25.412px;
  }

  :root[data-input-modality="pointer"] .close-button:focus-visible,
  :root[data-input-modality="pointer"]
    .chat-setting-menu
    > button:focus-visible,
  :root[data-input-modality="pointer"]
    .chat-input-preview
    .permission:focus-visible,
  :root[data-input-modality="pointer"]
    .chat-input-preview
    .quick:focus-visible {
    outline: none;
  }

  .chat-section {
    padding-top: 0;
  }
  .chat-copy > .eyebrow {
    font-size: 14px;
    line-height: 17px;
  }
  .chat-copy h2 {
    line-height: 35px;
  }
  .chat-features li {
    line-height: 19px;
  }
  .chat-copy > .button {
    min-height: 63px;
    line-height: 21px;
  }
  .chat-bubbles {
    display: block;
    width: 116px;
    height: 117px;
    left: 0;
    top: 219px;
    z-index: 3;
    opacity: 1;
  }

  .demo-section {
    padding-block: 60px;
  }
  .demo-section > .container > p:not(.form-message) {
    margin-top: 20px;
    line-height: 19px;
  }
  .demo-section .lead-form-inline {
    margin-top: 30px;
  }
  .lead-form-inline .lead-fields {
    gap: 20px;
  }
  .lead-form-inline .lead-submit {
    font-size: 16px;
    font-weight: 500;
  }
  .advantages {
    padding-top: 0;
  }
  .advantages h2 {
    text-align: center;
  }
  .advantages-grid {
    gap: 1px;
    border-radius: 10px;
  }
  .advantages-grid article {
    padding: 20px;
    min-height: 229px;
    border: 0;
  }
  .advantages-grid article:nth-child(n) {
    border-radius: 0;
  }
  .advantages-grid article:first-child {
    border-radius: 9px 9px 0 0;
  }
  .advantages-grid article:last-child {
    border-radius: 0 0 9px 9px;
    border-bottom: 0;
  }
  .advantage-icon {
    width: 50px;
    height: 50px;
    margin-bottom: 23px;
  }
  .advantages-grid h3 {
    line-height: 24px;
  }
  .advantages-grid p {
    max-width: 304px;
    line-height: 19px;
  }
  .comparison .lead {
    line-height: 22px;
  }
  .comparison thead th {
    font-size: 14px;
    line-height: 17px;
  }
  .comparison tbody th {
    line-height: 19px;
  }
  .comparison-duration {
    display: block;
    white-space: nowrap;
  }
  .comparison tbody td {
    height: 73.594px;
  }
  .case-section h2 {
    margin-bottom: 20px;
  }
  .case-grid {
    gap: 20px;
  }
  .case-company,
  .case-quote,
  .case-years,
  .case-stats {
    padding: 20px;
    border-radius: 15px;
  }
  .case-company h3 {
    line-height: 24px;
    max-width: 302px;
  }
  .case-quote p {
    line-height: 22px;
    max-width: 302px;
  }
  .quote-continuation {
    display: block;
  }
  .case-years strong {
    font-size: 45px;
    line-height: 52.8px;
  }
  .case-years strong span {
    font-size: 20px;
    line-height: 24px;
  }
  .case-years p,
  .case-stats p {
    font-size: 18px;
    line-height: 22px;
  }
  .case-stats {
    gap: 20px;
  }
  .case-stats strong {
    font-size: 40px;
    line-height: 45.6px;
  }
  .case-stats strong span {
    font-size: 24px;
    line-height: 29px;
  }
  .steps-section h2,
  .steps-section .lead {
    text-align: center;
  }
  .steps-section .lead {
    font-size: 20px;
    line-height: 24px;
  }
  .steps-grid {
    margin-top: 24px;
    gap: 20px;
  }
  .steps-grid h3 {
    font-weight: 600;
    line-height: 24px;
  }
  .steps-grid p {
    line-height: 19px;
  }
  .pricing-grid {
    gap: 20px;
  }
  .price-card,
  .custom-card {
    padding: 20px;
    border-radius: 15px;
  }
  .price-card h3 {
    font-size: 24px;
    line-height: 29px;
    max-width: 302px;
  }
  .price-card .lead,
  .custom-card .lead {
    line-height: 22px;
    max-width: 302px;
  }
  .price-card .button {
    max-width: 302px;
    font-weight: 500;
  }
  .price-card small {
    line-height: 15px;
    max-width: 302px;
  }
  .custom-card .lead {
    text-align: left;
    align-self: flex-start;
  }
  .custom-icons {
    max-width: 302px;
  }
  .footer {
    padding-block: 60px;
  }
  .footer-grid {
    gap: 20px;
  }
  .footer .logo {
    margin-bottom: 0;
  }
  .footer h2 {
    font-weight: 600;
    line-height: 24px;
  }
  .footer p,
  .footer a,
  .footer button {
    line-height: 19px;
  }
  .footer address > a {
    line-height: 24px;
  }
  .footer address > p:first-of-type {
    margin-top: 12px;
    margin-bottom: 15px;
  }
  .footer .document-link {
    text-decoration: underline;
  }
  .footer .contact-dot {
    color: white;
  }
}
@media (max-width: 360px) {
  .audience h2 {
    font-size: clamp(23px, 7.22vw, 26px);
  }
  .chat-bubbles {
    top: 43%;
    width: 96px;
    height: 96px;
  }
}

/* Same soft reveals as the chat landing; hover transforms remain independent. */
@media (prefers-reduced-motion: no-preference) {
  .card-reveal {
    opacity: 0;
  }
  .card-reveal.is-revealed {
    opacity: 1;
    animation: landing-card-reveal 0.6s ease-in-out
      var(--card-reveal-delay, 0ms) both;
  }
  .card-reveal:focus-within {
    opacity: 1;
  }
  .image-reveal {
    transition: opacity 0.36s ease;
  }
  .image-reveal:not(.is-ready) {
    opacity: 0;
  }
  .hero-preview .image-reveal.is-ready {
    animation: landing-card-reveal 0.8s ease-in-out both;
  }
}
@keyframes landing-card-reveal {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@media print {
  .card-reveal,
  .image-reveal {
    opacity: 1 !important;
    animation: none !important;
    transition: none !important;
  }
}

/* Shared modal motion. The native dialog stays in the top layer until its
   exit finishes, so focus trapping and the nested scroll lock remain intact. */
.ui-dialog {
  opacity: 0;
  transform: translateY(14px) scale(0.985);
  transition:
    opacity 0.24s ease,
    transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.ui-dialog.is-open {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.ui-dialog::backdrop {
  opacity: 0;
  transition: opacity 0.24s ease;
}
.ui-dialog.is-open::backdrop {
  opacity: 1;
}
.dialog-body {
  overscroll-behavior: contain;
}
@media (prefers-reduced-motion: reduce) {
  .ui-dialog,
  .ui-dialog::backdrop {
    transition: none;
    transform: none;
  }
}

/* Mobile header and footer spacing from the November Figma revision. */
@media (max-width: 600px) {
  .site-header {
    height: 66px;
    background: rgb(255 255 255 / 90%);
    border-bottom: 0;
  }
  .header-inner {
    position: relative;
    height: 66px;
    padding: 8px 16px;
  }
  .site-header .logo {
    width: 50px;
    height: 50px;
  }
  .header-logo-desktop,
  .header-phone-desktop {
    display: none;
  }
  .header-logo-mobile,
  .header-phone-mobile {
    display: block;
  }
  .header-logo-mobile {
    width: 50px;
    height: 50px;
  }
  .header-phone img {
    width: 24px;
    height: 24px;
  }
  .header-phone {
    display: flex;
    position: absolute;
    left: 50%;
    top: 21px;
    transform: translateX(-50%);
    margin: 0;
    gap: 8px;
    font-size: 14px;
    font-weight: 600;
    line-height: 17px;
    color: #262a38;
  }
  .menu-toggle {
    width: 24px;
    height: 24px;
    padding: 0;
    border: 0;
    border-radius: 0;
    background: url("/figma/header-menu.svg") center / 24px 24px no-repeat;
    align-items: center;
  }
  .menu-toggle:not(.is-open) span {
    display: none;
  }
  .menu-toggle.is-open {
    background: none;
  }
  .mobile-menu {
    top: 66px;
    max-height: calc(100dvh - 66px);
  }

  .footer .logo {
    margin-bottom: 20px;
  }
  .footer address > a {
    display: block;
    min-height: 24px;
  }
  .footer address > p:first-of-type {
    margin-bottom: 0;
    min-height: 24px;
    line-height: 24px;
  }
  .footer address > p + p {
    margin-top: 10px;
  }
  .footer-company > p:nth-of-type(2) {
    min-height: 24px;
  }
  .footer .document-link {
    min-height: 24px;
  }
}

/* Exact exported message tails and read receipts from the ERP chat design. */
.chat-messages .bubble {
  padding: 10px 15px;
  color: #181818;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
  flex-shrink: 0;
  display: flow-root;
}
.chat-messages .bubble::after {
  content: "";
  position: absolute;
  bottom: 0;
  width: 6px;
  height: 10px;
  background: center / 100% 100% no-repeat;
  pointer-events: none;
}
.chat-messages .incoming::after {
  left: -6px;
  background-image: url("/figma/chat-tail-in.svg");
}
.chat-messages .outgoing::after {
  right: -6px;
  background-image: url("/figma/chat-tail-out.svg");
  transform: scaleX(-1);
}
.bubble .message-meta {
  float: right;
  display: inline-flex;
  align-items: center;
  gap: 2px;
  height: 20px;
  margin: 0 0 0 10px;
  font-size: 12px;
  line-height: 20px;
  white-space: nowrap;
}
.message-read {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}
.message-read img {
  width: 20px;
  height: 10px;
}
.chat-compose {
  display: block;
  width: 100%;
  min-width: 0;
  min-height: 24px;
  max-height: 96px;
  border: 0;
  padding: 2px 0;
  margin: 0;
  background: transparent;
  resize: none;
  font: inherit;
  line-height: 20px;
  color: #181818;
}
.chat-compose::placeholder {
  color: #757d8a;
  opacity: 1;
}
.chat-compose:focus {
  outline: none;
}
.chat-input-preview .send-tool {
  border: 0;
  background: var(--tint);
  transition: background-color 0.2s ease;
}
.chat-input-preview .send-tool:disabled {
  background: #f5f5f5;
  cursor: default;
}
.chat-input-preview .send-tool:not(:disabled) img {
  filter: none;
  opacity: 1;
}
.chat-window.is-conversing {
  display: flex;
  flex-direction: column;
  height: var(--conversation-height);
}
.chat-messages.is-conversing {
  height: 0;
  flex: 1;
  max-height: none;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  scroll-padding-block: 16px;
}
.chat-window.is-conversing .chat-window-header,
.chat-window.is-conversing .chat-input-preview {
  flex-shrink: 0;
}
.demo-chat-entry {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  flex-shrink: 0;
}
.demo-chat-entry .chat-demo-link {
  display: block;
  width: fit-content;
  max-width: 100%;
  margin-top: 12px;
  padding: 8px 12px;
  min-height: 36px;
  font-size: inherit;
  line-height: 1.4;
  white-space: normal;
}
.chat-typing {
  display: flex !important;
  align-items: center;
  gap: 4px;
  min-height: 34px;
}
.chat-typing span {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #757d8a;
  animation: demo-typing 1s ease-in-out infinite;
}
.chat-typing span:nth-child(2) {
  animation-delay: 0.15s;
}
.chat-typing span:nth-child(3) {
  animation-delay: 0.3s;
}
@keyframes demo-typing {
  50% {
    opacity: 0.3;
  }
}
@media (max-width: 600px) {
  .chat-messages .bubble {
    max-width: calc(100% - 12px);
    padding: 8.47px 12.7px;
  }
  .bubble .message-meta {
    height: 17px;
    font-size: 10.16px;
    line-height: 17px;
    margin-left: 8px;
  }
  .message-read {
    width: 17px;
    height: 17px;
  }
  .message-read img {
    width: 17px;
    height: 8.5px;
  }
  .chat-compose {
    flex: 1;
    order: 2;
    width: 0;
    min-height: 24px;
    font-size: 16px;
    line-height: 20px;
  }
  .chat-compose::placeholder {
    font-size: 13.55px;
  }
  .chat-input-preview .chat-input-tool.send-tool {
    display: inline-flex;
    order: 4;
    padding: 4px;
    width: 25.412px;
    height: 25.412px;
  }
  .chat-input-preview .send-tool img {
    width: 17px;
    height: 17px;
  }
}
`;function h(a,n=390){return`${a.replace(/\((min|max)-width:\s*(\d+(?:\.\d+)?)px\)/g,(p,e,t)=>(e==="min"?n>=Number(t):n<=Number(t))?"(min-width: 0px)":"(max-width: 0px)").replace(/(-?\d*\.?\d+)vw\b/g,(p,e)=>`${Number(e)*n/100}px`)}
    html { background: #e9edf5; }
    body {
      width: min(${n}px, 100%);
      min-width: 0;
      margin-inline: auto;
      background: var(--surface);
      box-shadow: 0 0 24px #26365a14;
    }
    .ui-dialog {
      max-width: min(${n-32}px, calc(100% - 32px));
    }
    .back-to-top {
      right: max(16px, calc((100vw - ${n}px) / 2 + 16px));
    }
  `}const i=document.createElement("style");i.dataset.mobilePreview="390";i.textContent=h(l).replaceAll("/figma/","./figma/");document.head.append(i);r.createRoot(document.getElementById("root")).render(o.jsx(d.StrictMode,{children:o.jsx(s,{})}));
