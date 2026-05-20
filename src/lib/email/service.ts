import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logging/logger";

const RESEND_API_KEY = process.env.RESEND_API_KEY;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ysf.shoop";

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  orderId?: string;
}

const emailContent = {
  en: {
    brand: "ysf.shoop",
    confirmation: {
      subject: "Order Confirmed — ysf.shoop",
      title: "Thank you for your order!",
      lines: (orderId: string) => [
        `Order number: #${orderId.slice(0, 8)}`,
        "Your order has been received successfully. We will confirm it shortly after reviewing the details.",
        "We will contact you to arrange delivery.",
      ],
      cta: "Track Your Order",
    },
    status: {
      subject: (orderId: string, label: string) => `Order #${orderId.slice(0, 8)} — ${label}`,
      title: (label: string) => `Order Update: ${label}`,
      messages: {
        confirmed: "Your order has been confirmed! It will be prepared soon.",
        packed: "Your order is being packed.",
        shipped: "Your order has been shipped! On its way to you.",
        delivered: "Your order has been delivered! We hope you love it.",
        cancelled: "Your order has been cancelled. Please contact us for inquiries.",
        refused: "Your order has been refused. Please contact us for inquiries.",
        returned: "Your order has been returned. We will process it.",
      } as Record<string, string>,
      cta: "Track Your Order",
    },
    abandoned: {
      subject: "You left something behind!",
      title: "Complete Your Order",
      lines: (itemCount: number) => [
        `You have ${itemCount} item(s) waiting in your cart.`,
        "Don't miss out on your favorite items. Complete your order now!",
        "Free shipping on orders over 500 SAR.",
      ],
      cta: "Return to Cart",
    },
  },
  ar: {
    brand: "ysf.shoop",
    confirmation: {
      subject: "تم تأكيد طلبك — ysf.shoop",
      title: "شكراً لطلبك!",
      lines: (orderId: string) => [
        `رقم الطلب: #${orderId.slice(0, 8)}`,
        "تم استلام طلبك بنجاح. سنقوم بتأكيده قريباً بعد مراجعة التفاصيل.",
        "سيتم التواصل معك لتأكيد موعد التوصيل.",
      ],
      cta: "تتبع طلبك",
    },
    status: {
      subject: (orderId: string, label: string) => `تحديث حالة الطلب #${orderId.slice(0, 8)} — ${label}`,
      title: (label: string) => `تحديث حالة الطلب: ${label}`,
      messages: {
        confirmed: "تم تأكيد طلبك! سيتم تجهيزه قريباً.",
        packed: "طلبك قيد التجهيز والتغليف.",
        shipped: "تم شحن طلبك! في طريقه إليك.",
        delivered: "تم توصيل طلبك بنجاح! نأمل أن يعجبك.",
        cancelled: "تم إلغاء طلبك. للاستفسار يرجى التواصل معنا.",
        refused: "تم رفض طلبك. للاستفسار يرجى التواصل معنا.",
        returned: "تم إرجاع طلبك. سنقوم بمعالجته.",
      } as Record<string, string>,
      cta: "تتبع طلبك",
    },
    abandoned: {
      subject: "تركت شيئاً خلفك!",
      title: "أكمل طلبك",
      lines: (itemCount: number) => [
        `لديك ${itemCount} منتج(ة) في سلة التسوق بانتظارك.`,
        "لا تفوت فرصة شراء منتجاتك المفضلة. أتمم طلبك الآن!",
        "توصيل مجاني للطلبات فوق 500 ريال.",
      ],
      cta: "العودة إلى السلة",
    },
  },
  fr: {
    brand: "ysf.shoop",
    confirmation: {
      subject: "Commande confirmée — ysf.shoop",
      title: "Merci pour votre commande!",
      lines: (orderId: string) => [
        `Numéro de commande: #${orderId.slice(0, 8)}`,
        "Votre commande a été reçue avec succès. Nous la confirmerons sous peu.",
        "Nous vous contacterons pour organiser la livraison.",
      ],
      cta: "Suivre votre commande",
    },
    status: {
      subject: (orderId: string, label: string) => `Commande #${orderId.slice(0, 8)} — ${label}`,
      title: (label: string) => `Mise à jour de la commande: ${label}`,
      messages: {
        confirmed: "Votre commande a été confirmée! Elle sera bientôt préparée.",
        packed: "Votre commande est en cours de préparation.",
        shipped: "Votre commande a été expédiée! En route vers vous.",
        delivered: "Votre commande a été livrée! Nous espérons qu'elle vous plaira.",
        cancelled: "Votre commande a été annulée. Contactez-nous pour plus d'informations.",
        refused: "Votre commande a été refusée. Contactez-nous pour plus d'informations.",
        returned: "Votre commande a été retournée. Nous la traiterons.",
      } as Record<string, string>,
      cta: "Suivre votre commande",
    },
    abandoned: {
      subject: "Vous avez oublié quelque chose!",
      title: "Finalisez votre commande",
      lines: (itemCount: number) => [
        `Vous avez ${itemCount} article(s) qui attendent dans votre panier.`,
        "Ne manquez pas vos articles préférés. Finalisez votre commande maintenant!",
        "Livraison gratuite pour les commandes de plus de 500 SAR.",
      ],
      cta: "Retour au panier",
    },
  },
  es: {
    brand: "ysf.shoop",
    confirmation: {
      subject: "Pedido confirmado — ysf.shoop",
      title: "¡Gracias por tu pedido!",
      lines: (orderId: string) => [
        `Número de pedido: #${orderId.slice(0, 8)}`,
        "Tu pedido ha sido recibido con éxito. Lo confirmaremos pronto.",
        "Te contactaremos para coordinar la entrega.",
      ],
      cta: "Rastrear tu pedido",
    },
    status: {
      subject: (orderId: string, label: string) => `Pedido #${orderId.slice(0, 8)} — ${label}`,
      title: (label: string) => `Actualización del pedido: ${label}`,
      messages: {
        confirmed: "¡Tu pedido ha sido confirmado! Se preparará pronto.",
        packed: "Tu pedido está siendo empacado.",
        shipped: "¡Tu pedido ha sido enviado! En camino hacia ti.",
        delivered: "¡Tu pedido ha sido entregado! Esperamos que te encante.",
        cancelled: "Tu pedido ha sido cancelado. Contáctanos para más información.",
        refused: "Tu pedido ha sido rechazado. Contáctanos para más información.",
        returned: "Tu pedido ha sido devuelto. Lo procesaremos.",
      } as Record<string, string>,
      cta: "Rastrear tu pedido",
    },
    abandoned: {
      subject: "¡Dejaste algo atrás!",
      title: "Completa tu pedido",
      lines: (itemCount: number) => [
        `Tienes ${itemCount} artículo(s) esperando en tu carrito.`,
        "No te pierdas tus artículos favoritos. ¡Completa tu pedido ahora!",
        "Envío gratis en pedidos superiores a 500 SAR.",
      ],
      cta: "Volver al carrito",
    },
  },
};

type Locale = keyof typeof emailContent;

const localeFromString = (locale?: string): Locale => {
  if (locale && locale in emailContent) return locale as Locale;
  return "en";
};

export async function sendEmail(payload: EmailPayload) {
  const supabase = await createClient();

  if (RESEND_API_KEY) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "ysf.shoop <noreply@ysf.shoop>",
          to: payload.to,
          subject: payload.subject,
          html: payload.html,
        }),
      });

      if (!res.ok) {
        throw new Error(`Resend error: ${res.status} ${await res.text()}`);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      logger.error("email_send_failed", { to: payload.to, subject: payload.subject, error: message });

      await supabase.from("email_logs").insert({
        to_email: payload.to,
        subject: payload.subject,
        body: payload.html,
        order_id: payload.orderId ?? null,
        status: "failed",
        error: message,
      });

      return;
    }
  }

  await supabase.from("email_logs").insert({
    to_email: payload.to,
    subject: payload.subject,
    body: payload.html,
    order_id: payload.orderId ?? null,
    status: RESEND_API_KEY ? "sent" : "pending",
  });

  logger.info("email_logged", { to: payload.to, subject: payload.subject });
}

function orderEmailHtml(opts: {
  title: string;
  bodyLines: string[];
  ctaText: string;
  ctaUrl: string;
  dir: "ltr" | "rtl";
  footer: string;
}) {
  const align = opts.dir === "rtl" ? "right" : "left";
  return `
<!DOCTYPE html>
<html dir="${opts.dir}">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f5f0eb;font-family:system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 16px;">
    <table width="480" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;">
      <tr><td style="background:#c9a84c;padding:24px;text-align:center;">
        <h1 style="margin:0;color:#fff;font-size:20px;">ysf.shoop</h1>
      </td></tr>
      <tr><td style="padding:32px 24px;text-align:${align};">
        <h2 style="margin:0 0 16px;font-size:18px;color:#1a1a1a;">${opts.title}</h2>
        ${opts.bodyLines.map((line) => `<p style="margin:0 0 8px;color:#666;font-size:14px;line-height:1.6;">${line}</p>`).join("")}
        <a href="${opts.ctaUrl}" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#c9a84c;color:#fff;text-decoration:none;border-radius:8px;font-size:14px;">${opts.ctaText}</a>
      </td></tr>
      <tr><td style="padding:16px 24px;border-top:1px solid #eee;text-align:center;">
        <p style="margin:0;font-size:12px;color:#999;">${opts.footer}</p>
      </td></tr>
    </table>
  </td></tr></table>
</body>
</html>`;
}

export function orderConfirmationEmail(orderId: string, customerEmail: string, locale?: string) {
  const l = localeFromString(locale);
  const content = emailContent[l].confirmation;
  const dir = l === "ar" ? "rtl" : "ltr";

  return sendEmail({
    to: customerEmail,
    subject: content.subject,
    html: orderEmailHtml({
      title: content.title,
      bodyLines: content.lines(orderId),
      ctaText: content.cta,
      ctaUrl: `${siteUrl}/${l === "en" ? "" : l}/track-order/${orderId}`,
      dir,
      footer: l === "ar" ? "ysf.shoop — جميع الحقوق محفوظة" : `ysf.shoop — ${l === "fr" ? "Tous droits réservés" : l === "es" ? "Todos los derechos reservados" : "All rights reserved."}`,
    }),
    orderId,
  });
}

export function orderStatusEmail(orderId: string, customerEmail: string, status: string, statusLabel: string, locale?: string) {
  const l = localeFromString(locale);
  const content = emailContent[l].status;
  const dir = l === "ar" ? "rtl" : "ltr";
  const message = content.messages[status] || "Your order status has been updated.";

  return sendEmail({
    to: customerEmail,
    subject: content.subject(orderId, statusLabel),
    html: orderEmailHtml({
      title: content.title(statusLabel),
      bodyLines: [
        `Order #${orderId.slice(0, 8)}`,
        message,
      ],
      ctaText: content.cta,
      ctaUrl: `${siteUrl}/${l === "en" ? "" : l}/track-order/${orderId}`,
      dir,
      footer: l === "ar" ? "ysf.shoop — جميع الحقوق محفوظة" : `ysf.shoop — ${l === "fr" ? "Tous droits réservés" : l === "es" ? "Todos los derechos reservados" : "All rights reserved."}`,
    }),
    orderId,
  });
}

export function abandonedCartEmail(customerEmail: string, orderId: string, itemCount: number, locale?: string) {
  const l = localeFromString(locale);
  const content = emailContent[l].abandoned;
  const dir = l === "ar" ? "rtl" : "ltr";

  return sendEmail({
    to: customerEmail,
    subject: content.subject,
    html: orderEmailHtml({
      title: content.title,
      bodyLines: content.lines(itemCount),
      ctaText: content.cta,
      ctaUrl: `${siteUrl}/${l === "en" ? "" : l}/cart`,
      dir,
      footer: l === "ar" ? "ysf.shoop — جميع الحقوق محفوظة" : `ysf.shoop — ${l === "fr" ? "Tous droits réservés" : l === "es" ? "Todos los derechos reservados" : "All rights reserved."}`,
    }),
    orderId,
  });
}

export function getEmailLogs() {
  return { emailContent, localeFromString };
}
