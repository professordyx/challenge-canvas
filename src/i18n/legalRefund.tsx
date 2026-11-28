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

export const refundPolicyContent: Record<Language, LegalDocument> = {
  en: {
    title: "Refund Policy",
    metaDescription: "30-day money-back guarantee and refund instructions for Challenge Canvas subscriptions sold by BlueStars.",
    updatedLabel: "Last updated: November 28, 2026",
    intro:
      "BlueStars offers a 30-day money-back guarantee on Challenge Canvas subscriptions. If you are not satisfied with your purchase for any reason, you may request a full refund within 30 days of your order date.",
    sections: [
      {
        heading: "1. 30-Day Money-Back Guarantee",
        paragraphs: [
          "You have 30 calendar days from the date of your purchase to request a full refund if you change your mind or decide that Challenge Canvas Premium is not right for you.",
          <>
            All orders and refunds are processed by our online reseller and Merchant of Record, Paddle.com, in accordance with{" "}
            <a href="https://www.paddle.com/legal/refund-policy" target="_blank" rel="noopener noreferrer" className={linkClass}>
              Paddle&apos;s Refund Policy
            </a>
            .
          </>,
        ],
      },
      {
        heading: "2. How to Request a Refund",
        paragraphs: [
          <>
            To request a refund, visit{" "}
            <a href="https://paddle.net" target="_blank" rel="noopener noreferrer" className={linkClass}>
              paddle.net
            </a>{" "}
            and enter the email address or order number from your receipt, or contact BlueStars support at{" "}
            <a href="mailto:diocelio@bluestars.com.br" className={linkClass}>
              diocelio@bluestars.com.br
            </a>{" "}
            with your order details.
          </>,
          "Once approved, Paddle issues the refund back to your original payment method. Processing times depend on your card issuer or payment provider.",
        ],
      },
      {
        heading: "3. Subscription Cancellations",
        paragraphs: [
          "You can cancel your monthly Premium subscription at any time from your Subscription page via the Paddle customer portal. Canceling stops future renewals, and your Premium access continues through the end of the current paid billing period. If a refund is issued for your current billing period, Premium access ends when the refund is processed.",
        ],
      },
    ],
  },
  pt: {
    title: "Política de Reembolso",
    metaDescription: "Garantia de reembolso de 30 dias e instruções para solicitar devolução nas assinaturas do Challenge Canvas pela BlueStars.",
    updatedLabel: "Última atualização: 28 de novembro de 2026",
    intro:
      "A BlueStars oferece garantia de reembolso de 30 dias nas assinaturas do Challenge Canvas. Se você não estiver satisfeito com sua compra por qualquer motivo, pode solicitar o reembolso integral em até 30 dias a partir da data do pedido.",
    sections: [
      {
        heading: "1. Garantia de Reembolso de 30 Dias",
        paragraphs: [
          "Você tem 30 dias corridos a partir da data da compra para solicitar o reembolso total caso mude de ideia ou decida que o Challenge Canvas Premium não atende às suas necessidades.",
          <>
            Todos os pedidos e reembolsos são processados por nosso revendedor online e Merchant of Record, Paddle.com, conforme a{" "}
            <a href="https://www.paddle.com/legal/refund-policy" target="_blank" rel="noopener noreferrer" className={linkClass}>
              Política de Reembolso da Paddle
            </a>
            .
          </>,
        ],
      },
      {
        heading: "2. Como Solicitar um Reembolso",
        paragraphs: [
          <>
            Para solicitar um reembolso, acesse{" "}
            <a href="https://paddle.net" target="_blank" rel="noopener noreferrer" className={linkClass}>
              paddle.net
            </a>{" "}
            com o e-mail ou número do pedido do seu recibo, ou envie os dados do pedido para o suporte da BlueStars em{" "}
            <a href="mailto:diocelio@bluestars.com.br" className={linkClass}>
              diocelio@bluestars.com.br
            </a>
            .
          </>,
          "Após a aprovação, a Paddle realiza o estorno para o mesmo método de pagamento utilizado na compra. O prazo de compensação depende do emissor do cartão ou provedor de pagamento.",
        ],
      },
      {
        heading: "3. Cancelamento de Assinatura",
        paragraphs: [
          "Você pode cancelar sua assinatura mensal Premium a qualquer momento na página Minha Assinatura, pelo portal do cliente da Paddle. O cancelamento interrompe futuras renovações e mantém o acesso Premium até o fim do período já pago. Quando um reembolso é concedido para o ciclo vigente, o acesso Premium se encerra no processamento do estorno.",
        ],
      },
    ],
  },
  es: {
    title: "Política de Reembolso",
    metaDescription: "Garantía de devolución de 30 días e instrucciones para solicitar reembolsos en las suscripciones de Challenge Canvas vendidas por BlueStars.",
    updatedLabel: "Última actualización: 28 de noviembre de 2026",
    intro:
      "BlueStars ofrece una garantía de devolución de 30 días en las suscripciones de Challenge Canvas. Si no estás satisfecho con tu compra por cualquier motivo, puedes solicitar un reembolso completo dentro de los 30 días posteriores a la fecha del pedido.",
    sections: [
      {
        heading: "1. Garantía de Devolución de 30 Días",
        paragraphs: [
          "Dispones de 30 días naturales desde la fecha de compra para solicitar un reembolso completo si cambias de opinión o decides que Challenge Canvas Premium no es adecuado para ti.",
          <>
            Todos los pedidos y reembolsos son procesados por nuestro revendedor en línea y Merchant of Record, Paddle.com, de acuerdo con la{" "}
            <a href="https://www.paddle.com/legal/refund-policy" target="_blank" rel="noopener noreferrer" className={linkClass}>
              Política de Reembolso de Paddle
            </a>
            .
          </>,
        ],
      },
      {
        heading: "2. Cómo Solicitar un Reembolso",
        paragraphs: [
          <>
            Para solicitar un reembolso, visita{" "}
            <a href="https://paddle.net" target="_blank" rel="noopener noreferrer" className={linkClass}>
              paddle.net
            </a>{" "}
            con el correo electrónico o número de pedido de tu recibo, o escribe al soporte de BlueStars a{" "}
            <a href="mailto:diocelio@bluestars.com.br" className={linkClass}>
              diocelio@bluestars.com.br
            </a>{" "}
            con los detalles de tu pedido.
          </>,
          "Una vez aprobado, Paddle emitirá el reembolso al mismo método de pago original. El tiempo de acreditación depende de tu entidad bancaria o proveedor de pagos.",
        ],
      },
      {
        heading: "3. Cancelación de Suscripción",
        paragraphs: [
          "Puedes cancelar tu suscripción mensual Premium en cualquier momento desde la página Mi Suscripción mediante el portal de clientes de Paddle. La cancelación detiene renovaciones futuras y conserva tu acceso Premium hasta el final del período ya pagado. Si se emite un reembolso del ciclo actual, el acceso Premium finaliza al procesarse el reembolso.",
        ],
      },
    ],
  },
};