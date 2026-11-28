import { Link } from "react-router-dom";
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
const PADDLE_MOR =
  "Our order process is conducted by our online reseller Paddle.com. Paddle.com is the Merchant of Record for all our orders. Paddle provides all customer service inquiries and handles returns.";

export const termsContent: Record<Language, LegalDocument> = {
  en: {
    title: "Terms & Conditions",
    metaDescription: "Terms and Conditions governing the use of Challenge Canvas, operated by BlueStars, including Paddle payment terms and AI usage rules.",
    updatedLabel: "Last updated: November 28, 2026",
    intro:
      "These Terms & Conditions form a binding agreement between you and BlueStars (\"we\", \"us\", \"BlueStars\"), the seller and operator of Challenge Canvas (challengecanvas.com). By creating an account or continuing to use Challenge Canvas, you confirm that you have legal capacity to agree and accept these Terms.",
    sections: [
      {
        heading: "1. The Service and Account Responsibility",
        paragraphs: [
          "Challenge Canvas is a web application for structuring strategic innovation challenges, collaborating with invited members, and optionally using AI tools for text improvement, canvas evaluation, interview transcription/filling, and infographic generation.",
          "You must provide accurate account information, keep your login credentials confidential, and accept responsibility for all activity under your account.",
        ],
      },
      {
        heading: "2. Plans, Payments & Paddle Merchant of Record",
        paragraphs: [
          PADDLE_MOR,
          <>
            Challenge Canvas offers a Free plan with monthly usage limits and a Premium monthly subscription (USD 5.00/month, auto-renewing until canceled). All payment, billing, tax, invoicing, cancellation, and refund mechanics are governed by{" "}
            <a href="https://www.paddle.com/legal/checkout-buyer-terms" target="_blank" rel="noopener noreferrer" className={linkClass}>
              Paddle&apos;s Buyer Terms
            </a>{" "}
            and our{" "}
            <Link to="/refund" className={linkClass}>
              Refund Policy
            </Link>
            .
          </>,
          "Upgrades unlock Premium immediately upon confirmed payment. You may cancel at any time via the customer portal; Premium access remains active until the end of the current paid billing period, after which your account returns to the Free plan without deleting existing canvases.",
        ],
      },
      {
        heading: "3. Acceptable Use and Prohibited Misuse",
        paragraphs: ["You agree not to misuse Challenge Canvas. Prohibited conduct includes:"],
        items: [
          "Unlawful activity, fraud, spam, harassment, hate speech, deepfakes, or deceptive impersonation.",
          "Infringing intellectual property, privacy, or publicity rights of any third party.",
          "Security interference, including malware distribution, probing, vulnerability scanning, automated scraping, reverse engineering, or circumventing technical or plan limits.",
          "Attempting to jailbreak, manipulate, or extract system prompts from AI features.",
        ],
      },
      {
        heading: "4. AI Features, User Content & Accuracy",
        paragraphs: [
          "You retain ownership of the text, audio recordings, and other inputs you submit, and you grant BlueStars a limited license to host and process that content solely to operate and deliver the service. You are solely responsible for your inputs, for obtaining consent from participants in recorded interviews, for having rights to all uploaded content, and for how you use generated outputs.",
          "AI-generated improvements, evaluations, transcriptions, and infographics may contain inaccuracies or omissions. You must verify all outputs before acting on them; outputs are not suitable for regulated legal, medical, financial, or other professional advice without qualified human oversight.",
          <>
            BlueStars reserves the right to moderate, filter, restrict, or remove content or outputs that violate these Terms. Rights-holders may report alleged IP infringement to{" "}
            <a href="mailto:diocelio@bluestars.com.br" className={linkClass}>
              diocelio@bluestars.com.br
            </a>
            ; repeated infringement results in account suspension or termination.
          </>,
        ],
      },
      {
        heading: "5. Intellectual Property",
        paragraphs: [
          "BlueStars retains all rights, title, and intellectual property in Challenge Canvas, including its software, interface, documentation, templates, and branding. Subject to these Terms, we grant you a limited, non-exclusive, non-transferable license to use the service within your active plan.",
        ],
      },
      {
        heading: "6. Service Availability, Warranties & Liability",
        paragraphs: [
          "Challenge Canvas is provided \"as is\" and \"as available\". BlueStars does not guarantee uninterrupted, timely, or error-free operation and disclaims implied warranties to the fullest extent permitted by law.",
          "To the maximum extent permitted by applicable law, BlueStars is not liable for indirect, incidental, or consequential damages (such as lost profits or data), and our aggregate liability is capped at the subscription fees you paid in the 12 months preceding the claim. Nothing in these Terms limits liability for fraud, death, personal injury, or any liability that cannot be excluded by law.",
        ],
      },
      {
        heading: "7. Suspension and Termination",
        paragraphs: [
          "BlueStars may suspend or terminate your access immediately in case of material breach, non-payment, security or fraud risk, or repeated or serious policy violations. Upon termination, your right to use the service ends; you may request deletion or export of your data by contacting diocelio@bluestars.com.br.",
        ],
      },
      {
        heading: "8. Changes & Contact",
        paragraphs: [
          <>
            We may update these Terms as the service evolves; continued use after updates take effect constitutes acceptance. Questions regarding these Terms can be sent to BlueStars at{" "}
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
    title: "Termos e Condições",
    metaDescription: "Termos e Condições de uso do Challenge Canvas, operado pela BlueStars, incluindo pagamentos via Paddle e uso de recursos de IA.",
    updatedLabel: "Última atualização: 28 de novembro de 2026",
    intro:
      "Estes Termos e Condições constituem um contrato vinculante entre você e a BlueStars (\"nós\", \"BlueStars\"), vendedora e operadora do Challenge Canvas (challengecanvas.com). Ao criar uma conta ou continuar utilizando o serviço, você declara ter capacidade legal e concorda com estes Termos.",
    sections: [
      {
        heading: "1. O Serviço e Responsabilidade pela Conta",
        paragraphs: [
          "O Challenge Canvas é uma aplicação web para estruturar desafios estratégicos de inovação, colaborar com membros convidados e utilizar recursos opcionais de IA para melhoria de textos, avaliação de canvas, transcrição e preenchimento de entrevistas e geração de infográficos.",
          "Você deve fornecer dados corretos, manter a confidencialidade de suas credenciais de acesso e responder por toda atividade realizada em sua conta.",
        ],
      },
      {
        heading: "2. Planos, Pagamentos e Paddle como Merchant of Record",
        paragraphs: [
          "Nosso processo de pedidos é conduzido por nosso revendedor online Paddle.com. A Paddle.com é a Merchant of Record de todos os nossos pedidos, presta o atendimento ao cliente relacionado a compras e processa devoluções.",
          PADDLE_MOR,
          <>
            O Challenge Canvas oferece um plano Gratuito com limites mensais e uma assinatura mensal Premium (USD 5,00/mês, renovada automaticamente até o cancelamento). Pagamentos, cobranças, tributos, cancelamentos e reembolsos seguem os{" "}
            <a href="https://www.paddle.com/legal/checkout-buyer-terms" target="_blank" rel="noopener noreferrer" className={linkClass}>
              Termos do Comprador da Paddle
            </a>{" "}
            e nossa{" "}
            <Link to="/refund" className={linkClass}>
              Política de Reembolso
            </Link>
            .
          </>,
          "O acesso Premium é liberado imediatamente após a confirmação do pagamento. Em caso de cancelamento, o acesso permanece ativo até o fim do período já pago, retornando depois ao plano Gratuito sem excluir seus canvas existentes.",
        ],
      },
      {
        heading: "3. Uso Aceitável e Condutas Proibidas",
        paragraphs: ["É proibido utilizar o Challenge Canvas de forma indevida, incluindo:"],
        items: [
          "Uso ilícito, fraude, spam, assédio, discurso de ódio, deepfakes ou falsidade ideológica.",
          "Violação de direitos autorais, propriedade intelectual, privacidade ou direitos de terceiros.",
          "Interferência na segurança do serviço, como malware, varredura de vulnerabilidades, raspagem automatizada (scraping), engenharia reversa ou contorno de limites técnicos ou de plano.",
          "Tentativas de jailbreak, injeção de prompt ou extração de instruções internas dos recursos de IA.",
        ],
      },
      {
        heading: "4. Recursos de IA, Conteúdo do Usuário e Precisão",
        paragraphs: [
          "Você mantém a titularidade dos textos, áudios e demais conteúdos enviados, concedendo à BlueStars licença limitada para hospedá-los e processá-los exclusivamente para prestar o serviço. Você é responsável por seus prompts, pelos direitos sobre o material enviado, pelo consentimento dos participantes em entrevistas gravadas e pelo uso das saídas geradas.",
          "As respostas de IA podem conter imprecisões ou omissões. Você deve revisar os resultados antes de utilizá-los; as saídas não substituem aconselhamento profissional regulado (jurídico, médico, financeiro ou contábil).",
          <>
            A BlueStars pode moderar, filtrar, restringir ou remover conteúdos que violem estes Termos. Titulares de direitos podem enviar notificações de remoção para{" "}
            <a href="mailto:diocelio@bluestars.com.br" className={linkClass}>
              diocelio@bluestars.com.br
            </a>
            ; infrações reiteradas resultam em suspensão ou encerramento da conta.
          </>,
        ],
      },
      {
        heading: "5. Propriedade Intelectual",
        paragraphs: [
          "A BlueStars mantém todos os direitos e propriedade intelectual sobre o Challenge Canvas, incluindo software, interface, documentação, modelos e marca. Concedemos a você uma licença limitada, não exclusiva e intransferível de uso conforme seu plano ativo.",
        ],
      },
      {
        heading: "6. Disponibilidade, Garantias e Limitação de Responsabilidade",
        paragraphs: [
          "O serviço é fornecido no estado em que se encontra, sem garantia de operação ininterrupta ou livre de erros. Na máxima extensão permitida por lei, a BlueStars não responde por danos indiretos ou lucros cessantes, e sua responsabilidade total limita-se aos valores pagos nos últimos 12 meses, ressalvadas hipóteses legais irrenunciáveis.",
        ],
      },
      {
        heading: "7. Suspensão e Encerramento",
        paragraphs: [
          "A BlueStars pode suspender ou encerrar seu acesso em caso de descumprimento relevante, inadimplência, risco de segurança ou fraude, ou violações graves ou reiteradas destas políticas. Encerrado o acesso, você pode solicitar exportação ou exclusão de dados via diocelio@bluestars.com.br.",
        ],
      },
      {
        heading: "8. Alterações e Contato",
        paragraphs: [
          <>
            Podemos atualizar estes Termos periodicamente; o uso contínuo após a vigência representa concordância. Dúvidas podem ser enviadas à BlueStars em{" "}
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
    title: "Términos y Condiciones",
    metaDescription: "Términos y Condiciones de uso de Challenge Canvas, operado por BlueStars, incluidos pagos mediante Paddle y uso de funciones de IA.",
    updatedLabel: "Última actualización: 28 de noviembre de 2026",
    intro:
      "Estos Términos y Condiciones constituyen un acuerdo vinculante entre tú y BlueStars (\"nosotros\", \"BlueStars\"), vendedor y operador de Challenge Canvas (challengecanvas.com). Al crear una cuenta o seguir utilizando el servicio, aceptas estos Términos.",
    sections: [
      {
        heading: "1. El Servicio y Responsabilidad de la Cuenta",
        paragraphs: [
          "Challenge Canvas es una aplicación web para estructurar desafíos estratégicos de innovación, colaborar con miembros invitados y usar herramientas opcionales de IA para mejora de textos, evaluación de canvas, transcripción/llenado de entrevistas y generación de infografías.",
          "Debes proporcionar datos exactos, mantener confidenciales tus credenciales y responsabilizarte por toda actividad realizada bajo tu cuenta.",
        ],
      },
      {
        heading: "2. Planes, Pagos y Paddle como Merchant of Record",
        paragraphs: [
          "Nuestro proceso de pedidos es gestionado por nuestro revendedor en línea Paddle.com. Paddle.com es el Merchant of Record de todos nuestros pedidos, atiende las consultas de clientes relacionadas con compras y gestiona las devoluciones.",
          PADDLE_MOR,
          <>
            Challenge Canvas ofrece un plan Gratuito con límites mensuales y una suscripción mensual Premium (USD 5,00/mes, con renovación automática hasta su cancelación). Pagos, facturación, impuestos, cancelaciones y reembolsos se rigen por los{" "}
            <a href="https://www.paddle.com/legal/checkout-buyer-terms" target="_blank" rel="noopener noreferrer" className={linkClass}>
              Términos del Comprador de Paddle
            </a>{" "}
            y nuestra{" "}
            <Link to="/refund" className={linkClass}>
              Política de Reembolso
            </Link>
            .
          </>,
          "El acceso Premium se activa inmediatamente tras la confirmación del pago. Si cancelas, mantendrás el acceso hasta el final del período ya pagado y luego volverás al plan Gratuito sin eliminar tus canvas existentes.",
        ],
      },
      {
        heading: "3. Uso Aceptable y Conductas Prohibidas",
        paragraphs: ["No debes hacer un uso indebido del servicio, incluyendo:"],
        items: [
          "Actividades ilícitas, fraude, spam, acoso, discurso de odio, deepfakes o suplantación.",
          "Infracción de propiedad intelectual, privacidad o derechos de terceros.",
          "Interferencia con la seguridad, como malware, sondeo de vulnerabilidades, scraping automatizado, ingeniería inversa o elusión de límites técnicos o de plan.",
          "Intentos de jailbreak o manipulación de los sistemas de inteligencia artificial.",
        ],
      },
      {
        heading: "4. Funciones de IA, Contenido del Usuario y Precisión",
        paragraphs: [
          "Conservas la titularidad de tus textos, grabaciones y contenidos enviados, otorgando a BlueStars una licencia limitada para alojarlos y procesarlos únicamente para prestar el servicio. Eres responsable de tus prompts, de contar con derechos y consentimiento de los participantes en entrevistas grabadas, y del uso de los resultados generados.",
          "Los resultados de IA pueden contener imprecisiones u omisiones. Debes verificar su exactitud; no constituyen asesoramiento profesional regulado (legal, médico o financiero) sin supervisión cualificada.",
          <>
            BlueStars puede moderar, filtrar o retirar contenido que infrinja estos Términos. Los titulares de derechos pueden enviar avisos de retirada a{" "}
            <a href="mailto:diocelio@bluestars.com.br" className={linkClass}>
              diocelio@bluestars.com.br
            </a>
            ; las infracciones reiteradas conllevarán la suspensión o terminación de la cuenta.
          </>,
        ],
      },
      {
        heading: "5. Propiedad Intelectual",
        paragraphs: [
          "BlueStars conserva todos los derechos de propiedad intelectual sobre Challenge Canvas, su software, interfaz, documentación y marca. Te concedemos una licencia limitada, no exclusiva e intransferible para usar el servicio según tu plan activo.",
        ],
      },
      {
        heading: "6. Disponibilidad, Garantías y Responsabilidad",
        paragraphs: [
          "El servicio se ofrece tal cual y según disponibilidad, sin garantía de funcionamiento ininterrumpido o libre de errores. En la máxima medida permitida por la ley, BlueStars no responde por daños indirectos o pérdida de beneficios, y su responsabilidad agregada se limita a las tarifas abonadas en los últimos 12 meses, salvo lo irrenunciable por ley.",
        ],
      },
      {
        heading: "7. Suspensión y Terminación",
        paragraphs: [
          "BlueStars puede suspender o terminar tu acceso en caso de incumplimiento sustancial, impago, riesgo de seguridad o fraude, o infracciones graves o repetidas. Al finalizar el acceso, puedes solicitar la exportación o eliminación de tus datos escribiendo a diocelio@bluestars.com.br.",
        ],
      },
      {
        heading: "8. Cambios y Contacto",
        paragraphs: [
          <>
            Podemos actualizar estos Términos; el uso continuado tras su entrada en vigor implica aceptación. Para consultas, escribe a BlueStars a{" "}
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