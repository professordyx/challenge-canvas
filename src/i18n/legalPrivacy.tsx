import type { Language } from "./translations";
import type { LegalSection } from "@/components/legal/LegalLayout";

interface LegalDocument {
  title: string;
  metaDescription: string;
  updatedLabel: string;
  intro: string;
  sections: LegalSection[];
}

const linkClass = "font-medium text-primary underline underline-offset-4 hover:text-accent";

export const privacyContent: Record<Language, LegalDocument> = {
  en: {
    title: "Privacy Notice",
    metaDescription: "How BlueStars collects, uses, shares, and protects personal data on Challenge Canvas, including Paddle and analytics disclosures.",
    updatedLabel: "Last updated: November 28, 2026",
    intro:
      "BlueStars (\"we\", \"us\", \"BlueStars\") is the data controller responsible for personal data processed when you visit or use Challenge Canvas (challengecanvas.com). This Privacy Notice explains what data we collect, why we use it, who we share it with, and your rights.",
    sections: [
      {
        heading: "1. Personal Data We Collect",
        items: [
          "Account and profile data: email address, password credentials or Google OAuth sign-in identifiers, display name, profile avatar, and language preference.",
          "Workspace content: challenge canvases, evaluation results, generated infographic images, sharing permissions (including collaborator emails), and interview audio submitted for transcription.",
          "Support communications: messages and order details you send to our support email.",
          "Technical and operational data: subscription status, API usage counters (excluding prompts or generated text), and network/browser metadata needed for authentication, security, and font delivery.",
        ],
      },
      {
        heading: "2. Purposes and Legal Bases",
        items: [
          "Providing the service (contract performance): creating and authenticating your account, saving and sharing canvases, managing plans, and running AI features you trigger.",
          "Security and reliability (legitimate interests / legal obligation): preventing abuse and fraud, enforcing access controls, troubleshooting errors, and maintaining service availability.",
          "Product improvement and support (legitimate interests / consent): measuring aggregate site usage, responding to inquiries, and honoring your preferences.",
        ],
      },
      {
        heading: "3. Who We Share Data With",
        items: [
          "Merchant of Record (Paddle.com): handles the sale of Challenge Canvas subscriptions, payment processing, billing, tax compliance, invoicing, and refunds.",
          "Service providers and subprocessors: cloud hosting, authentication, database, and file storage providers; AI providers (Anthropic and Google Gemini) strictly when you invoke AI improvement, evaluation, transcription, or infographic features; Google Fonts to deliver typography; and Lovable for visitor analytics.",
          "Professional advisers: legal, tax, and accounting advisers under confidentiality obligations.",
          "Authorities: public or regulatory authorities where disclosure is required by law.",
        ],
      },
      {
        heading: "4. Visitor Analytics, Cookies & Browser Storage",
        paragraphs: [
          <>
            We use Lovable&apos;s visitor analytics to understand how the site is used. Lovable&apos;s analytics uses no cookies, stores nothing on your device, doesn&apos;t keep IP addresses, and doesn&apos;t identify visitors. Lovable collects this data for us.{" "}
            <a href="https://lovable.dev/privacy" target="_blank" rel="noopener noreferrer" className={linkClass}>
              Lovable&apos;s privacy policy
            </a>{" "}
            explains how it handles it.
          </>,
          "On this site, Lovable's analytics records the pages visited, where visitors came from, their country, browser, operating system and device type, how long they stay, how fast pages load, errors, and clicks. Detailed data is kept for 90 days and daily summaries for a year.",
          "We record clicks and other actions for every visitor, unless your browser sends a Global Privacy Control signal. We count basic visit statistics for every visitor: pages visited, time on page, page speed and errors. This uses no cookies and doesn't identify you.",
          "Our hosting provider sets one strictly necessary cookie. It makes sure every page you load comes from the same version of the site. It holds no information about you and expires within 7 days.",
          "Other site tools: signing in with email/password or Google OAuth stores authentication session tokens in your browser's local storage so you stay signed in; your language selection is saved in local storage; loading Google Fonts connects to Google's servers to fetch typefaces; and opening checkout or billing management loads Paddle's script from Paddle.com.",
        ],
      },
      {
        heading: "5. Data Retention & International Transfers",
        paragraphs: [
          "We keep your account and canvas data while your account remains active or until you delete it. Interview audio is processed transiently to generate your transcript and is not stored permanently. Operational logs and analytics are retained only as long as needed (visitor analytics: 90 days detailed, 1 year daily summaries) and are deleted or anonymised once no longer required.",
          "Because our cloud, AI, and payment providers operate globally, data may be transferred outside the UK, EEA, or Brazil. Where required, we rely on recognized safeguards such as Standard Contractual Clauses or adequacy decisions.",
        ],
      },
      {
        heading: "6. Security & Your Rights",
        paragraphs: [
          "BlueStars applies technical and organisational security measures including encryption in transit and at rest, authenticated access controls, and row-level database isolation.",
          <>
            Depending on your location (including under GDPR, UK GDPR, and LGPD), you have the right to access, rectify, erase, restrict, or port your personal data, object to processing, withdraw consent, and lodge a complaint with a supervisory authority. We respond to rights requests within one month. To exercise your rights, contact BlueStars at{" "}
            <a href="mailto:diocelio@bluestars.com.br" className={linkClass}>
              diocelio@bluestars.com.br
            </a>
            .
          </>,
        ],
      },
    ],
  },
  pt: {
    title: "Aviso de Privacidade",
    metaDescription: "Como a BlueStars coleta, utiliza, compartilha e protege dados pessoais no Challenge Canvas, incluindo Paddle e analytics.",
    updatedLabel: "Última atualização: 28 de novembro de 2026",
    intro:
      "A BlueStars (\"nós\", \"BlueStars\") atua como controladora dos dados pessoais tratados quando você visita ou utiliza o Challenge Canvas (challengecanvas.com). Este Aviso de Privacidade explica quais dados coletamos, para que os usamos, com quem compartilhamos e quais são seus direitos.",
    sections: [
      {
        heading: "1. Dados Pessoais Coletados",
        items: [
          "Dados de conta e perfil: e-mail, credenciais de acesso ou identificadores do login Google OAuth, nome de exibição, avatar e idioma preferido.",
          "Conteúdo do workspace: canvas de desafios, avaliações, infográficos gerados, permissões de compartilhamento (incluindo e-mails de colaboradores) e áudios de entrevista enviados para transcrição.",
          "Comunicações de suporte: mensagens e informações de pedido enviadas ao nosso suporte.",
          "Dados técnicos e operacionais: status da assinatura, contadores de uso da API (sem armazenar prompts ou textos gerados) e metadados de navegador/rede necessários para autenticação, segurança e carregamento de fontes.",
        ],
      },
      {
        heading: "2. Finalidades e Bases Legais",
        items: [
          "Prestação do serviço (execução de contrato): criação e autenticação de conta, armazenamento e compartilhamento de canvas, gestão de planos e execução dos recursos de IA solicitados por você.",
          "Segurança e estabilidade (legítimo interesse / obrigação legal): prevenção de fraudes e abusos, controle de acesso, correção de falhas e disponibilidade do serviço.",
          "Melhoria do produto e atendimento (legítimo interesse / consentimento): medição agregada de visitas, suporte ao cliente e preservação de preferências.",
        ],
      },
      {
        heading: "3. Compartilhamento de Dados",
        items: [
          "Merchant of Record (Paddle.com): responsável pela venda das assinaturas do Challenge Canvas, gestão de assinaturas, pagamentos, conformidade fiscal, faturamento e reembolsos.",
          "Provedores e suboperadores: infraestrutura de nuvem, autenticação, banco de dados e armazenamento; provedores de IA (Anthropic e Google Gemini) exclusivamente quando você aciona melhoria de texto, avaliação, transcrição ou infográficos; Google Fonts para entrega de tipografia; e Lovable para análise de visitas.",
          "Consultores profissionais: assessores jurídicos e contábeis sob sigilo.",
          "Autoridades públicas: quando exigido por lei ou determinação regulatória.",
        ],
      },
      {
        heading: "4. Análise de Visitas, Cookies e Armazenamento Local",
        paragraphs: [
          <>
            Utilizamos a análise de visitas da Lovable para entender o uso do site. Essa ferramenta não usa cookies, não armazena nada no seu dispositivo, não guarda endereços IP e não identifica visitantes. A Lovable coleta esses dados para nós; a{" "}
            <a href="https://lovable.dev/privacy" target="_blank" rel="noopener noreferrer" className={linkClass}>
              política de privacidade da Lovable
            </a>{" "}
            explica como eles são tratados.
          </>,
          "Neste site, a análise registra as páginas visitadas, de onde os visitantes vieram, país, navegador, sistema operacional e tipo de dispositivo, tempo de permanência, velocidade de carregamento, erros e cliques. Os dados detalhados são mantidos por 90 dias e os resumos diários por um ano.",
          "Registramos cliques e outras ações de todos os visitantes, a menos que seu navegador envie um sinal de Global Privacy Control. Contamos estatísticas básicas de visita para todos os visitantes: páginas visitadas, tempo na página, velocidade da página e erros. Isso não usa cookies e não identifica você.",
          "Nosso provedor de hospedagem define um cookie estritamente necessário. Ele garante que todas as páginas carregadas venham da mesma versão do site. Ele não guarda informações sobre você e expira em até 7 dias.",
          "Outras ferramentas do site: o login por e-mail/senha ou Google OAuth armazena tokens de sessão no localStorage do navegador para manter você conectado; o idioma escolhido é salvo no localStorage; o carregamento do Google Fonts conecta-se aos servidores do Google para exibir as fontes; e ao abrir o checkout ou gerenciar a assinatura, o script da Paddle.com é carregado.",
        ],
      },
      {
        heading: "5. Retenção e Transferências Internacionais",
        paragraphs: [
          "Mantemos os dados da conta e dos canvas enquanto sua conta estiver ativa ou até sua exclusão. Áudios de entrevista são processados de forma transitória para gerar a transcrição e não ficam armazenados permanentemente. Quando não são mais necessários, os dados são excluídos ou anonimizados.",
          "Como nossos provedores de nuvem, IA e pagamentos operam globalmente, os dados podem ser transferidos para fora do Brasil, Reino Unido ou EEE, com salvaguardas apropriadas como Cláusulas Contratuais Padrão ou decisões de adequação.",
        ],
      },
      {
        heading: "6. Segurança e Seus Direitos",
        paragraphs: [
          "A BlueStars adota medidas técnicas e organizacionais adequadas, incluindo criptografia em trânsito e em repouso, controles de acesso autenticados e isolamento de dados por usuário.",
          <>
            Conforme a legislação aplicável (incluindo LGPD e GDPR), você tem direito de acesso, retificação, exclusão, restrição, portabilidade, oposição, revogação de consentimento e reclamação à autoridade supervisora. Respondemos às solicitações em até 1 mês. Para exercer seus direitos, contate a BlueStars em{" "}
            <a href="mailto:diocelio@bluestars.com.br" className={linkClass}>
              diocelio@bluestars.com.br
            </a>
            .
          </>,
        ],
      },
    ],
  },
  es: {
    title: "Aviso de Privacidad",
    metaDescription: "Cómo BlueStars recopila, utiliza, comparte y protege datos personales en Challenge Canvas, incluyendo Paddle y analítica.",
    updatedLabel: "Última actualización: 28 de noviembre de 2026",
    intro:
      "BlueStars (\"nosotros\", \"BlueStars\") es el responsable del tratamiento de los datos personales recopilados cuando visitas o utilizas Challenge Canvas (challengecanvas.com). Este Aviso de Privacidad explica qué datos recopilamos, con qué fines, con quién los compartimos y cuáles son tus derechos.",
    sections: [
      {
        heading: "1. Datos Personales que Recopilamos",
        items: [
          "Datos de cuenta y perfil: correo electrónico, credenciales de acceso o identificadores de Google OAuth, nombre visible, avatar e idioma preferido.",
          "Contenido del espacio de trabajo: canvas de desafíos, resultados de evaluación, infografías generadas, permisos de uso compartido (incluidos correos de colaboradores) y audio de entrevistas enviado para transcripción.",
          "Comunicaciones de soporte: mensajes y detalles de pedido que envíes a nuestro soporte.",
          "Datos técnicos y operativos: estado de la suscripción, contadores de uso de la API (sin almacenar prompts ni textos generados) y metadatos de red/navegador necesarios para autenticación, seguridad y carga de fuentes.",
        ],
      },
      {
        heading: "2. Finalidades y Bases Legales",
        items: [
          "Prestación del servicio (ejecución de contrato): crear y autenticar tu cuenta, guardar y compartir canvas, gestionar planes y ejecutar las funciones de IA que solicites.",
          "Seguridad y fiabilidad (interés legítimo / obligación legal): prevenir fraude y abusos, aplicar controles de acceso, diagnosticar errores y mantener la disponibilidad.",
          "Mejora del producto y soporte (interés legítimo / consentimiento): medir uso agregado del sitio, atender consultas y recordar tus preferencias.",
        ],
      },
      {
        heading: "3. Con Quién Compartimos Datos",
        items: [
          "Merchant of Record (Paddle.com): gestiona la venta de suscripciones de Challenge Canvas, pagos, facturación, cumplimiento fiscal, gestión de suscripciones y reembolsos.",
          "Proveedores y subencargados: infraestructura en la nube, autenticación, base de datos y almacenamiento; proveedores de IA (Anthropic y Google Gemini) únicamente cuando utilizas funciones de mejora, evaluación, transcripción o infografías; Google Fonts para servir tipografía; y Lovable para analítica de visitas.",
          "Asesores profesionales: asesores legales y contables bajo obligaciones de confidencialidad.",
          "Autoridades: cuando la divulgación sea exigida por ley.",
        ],
      },
      {
        heading: "4. Analítica de Visitas, Cookies y Almacenamiento Local",
        paragraphs: [
          <>
            Usamos la analítica de visitas de Lovable para comprender el uso del sitio. Esta analítica no usa cookies, no guarda nada en tu dispositivo, no conserva direcciones IP y no identifica visitantes. Lovable recopila estos datos para nosotros; la{" "}
            <a href="https://lovable.dev/privacy" target="_blank" rel="noopener noreferrer" className={linkClass}>
              política de privacidad de Lovable
            </a>{" "}
            explica cómo los trata.
          </>,
          "En este sitio registra las páginas visitadas, el origen de la visita, país, navegador, sistema operativo y tipo de dispositivo, tiempo de permanencia, velocidad de carga, errores y clics. Los datos detallados se conservan 90 días y los resúmenes diarios durante un año.",
          "Registramos clics y otras acciones para todos los visitantes, salvo que tu navegador envíe una señal Global Privacy Control. Contamos estadísticas básicas de visita para todos los visitantes: páginas visitadas, tiempo en la página, velocidad y errores. Esto no usa cookies ni te identifica.",
          "Nuestro proveedor de alojamiento establece una cookie estrictamente necesaria. Garantiza que cada página cargada provenga de la misma versión del sitio. No contiene información sobre ti y caduca en un máximo de 7 días.",
          "Otras herramientas del sitio: el inicio de sesión con correo/contraseña o Google OAuth guarda tokens de sesión en el almacenamiento local del navegador; tu idioma se guarda en localStorage; Google Fonts se conecta a los servidores de Google para mostrar tipografías; y al abrir el pago o portal de facturación se carga el script de Paddle.com.",
        ],
      },
      {
        heading: "5. Conservación y Transferencias Internacionales",
        paragraphs: [
          "Conservamos los datos de tu cuenta y canvas mientras tu cuenta esté activa o hasta que los elimines. El audio de entrevistas se procesa de manera transitoria para generar la transcripción y no se almacena de forma permanente. Los datos se eliminan o anonimizan cuando dejan de ser necesarios.",
          "Dado que nuestros proveedores de nube, IA y pagos operan globalmente, los datos pueden transferirse fuera del EEE, Reino Unido o tu país con salvaguardas adecuadas como Cláusulas Contractuales Tipo o decisiones de adecuación.",
        ],
      },
      {
        heading: "6. Seguridad y Tus Derechos",
        paragraphs: [
          "BlueStars aplica medidas técnicas y organizativas adecuadas, incluido cifrado en tránsito y en reposo, controles de acceso y aislamiento de datos a nivel de fila.",
          <>
            Según la normativa aplicable (incluidos RGPD y leyes locales de protección de datos), tienes derecho de acceso, rectificación, supresión, limitación, portabilidad, oposición, retirada del consentimiento y reclamación ante una autoridad de control. Respondemos en el plazo de 1 mes. Para ejercer tus derechos, escribe a BlueStars a{" "}
            <a href="mailto:diocelio@bluestars.com.br" className={linkClass}>
              diocelio@bluestars.com.br
            </a>
            .
          </>,
        ],
      },
    ],
  },
};