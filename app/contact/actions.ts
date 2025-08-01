"use server"

import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { resend } from "@/lib/resend"

const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
})

export async function submitContactForm(prevState: { success: boolean; message: string } | null, formData: FormData) {
  try {
    const data = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    }

    const validatedData = contactSchema.parse(data)

    // Determine priority based on subject
    let priority: "LOW" | "NORMAL" | "HIGH" | "URGENT" = "NORMAL"
    if (
      validatedData.subject.toLowerCase().includes("urgent") ||
      validatedData.subject.toLowerCase().includes("emergency")
    ) {
      priority = "URGENT"
    } else if (validatedData.subject === "Technical Support") {
      priority = "HIGH"
    } else if (validatedData.subject === "Partnership Opportunity") {
      priority = "HIGH"
    }

    // Save to database
    const contactSubmission = await prisma.contactSubmission.create({
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        subject: validatedData.subject,
        message: validatedData.message,
        priority: priority,
      },
    })

    // Send confirmation email to user
    try {
      await resend.emails.send({
        from: "HealthNews.Guru <support@healthnews.guru>",
        to: [validatedData.email],
        subject: "We received your message - HealthNews.Guru",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #dc2626, #b91c1c); padding: 40px 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Message Received!</h1>
              <p style="color: #fecaca; margin: 10px 0 0 0; font-size: 16px;">We'll get back to you soon</p>
            </div>
            
            <div style="padding: 40px 20px; background: white;">
              <h2 style="color: #374151; margin-bottom: 20px;">Hi ${validatedData.firstName}!</h2>
              
              <p style="color: #6b7280; line-height: 1.6; margin-bottom: 20px;">
                Thank you for contacting HealthNews.Guru. We've received your message and will respond within 24 hours.
              </p>
              
              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #dc2626; margin-top: 0;">Your Message Details:</h3>
                <p style="margin: 5px 0;"><strong>Subject:</strong> ${validatedData.subject}</p>
                <p style="margin: 5px 0;"><strong>Reference ID:</strong> #${contactSubmission.id.slice(-8).toUpperCase()}</p>
              </div>
              
              <p style="color: #6b7280; line-height: 1.6;">
                If you have any urgent matters, please don't hesitate to reach out to us directly at editorial@healthnews.guru.
              </p>
              
              <p style="color: #6b7280; line-height: 1.6;">
                Best regards,<br>
                <strong>The HealthNews.Guru Support Team</strong>
              </p>
            </div>
            
            <div style="background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af;">
              <p>HealthNews.Guru | Your trusted health news source</p>
            </div>
          </div>
        `,
      })
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError)
    }

    // Send notification to team
    try {
      const teamEmail =
        validatedData.subject === "Editorial Question"
          ? "editorial@healthnews.guru"
          : validatedData.subject === "Technical Support"
            ? "support@healthnews.guru"
            : validatedData.subject === "Partnership Opportunity"
              ? "partnerships@healthnews.guru"
              : "info@healthnews.guru"

      await resend.emails.send({
        from: "HealthNews.Guru <support@healthnews.guru>",
        to: [teamEmail],
        subject: `${priority === "URGENT" ? "🚨 URGENT - " : priority === "HIGH" ? "⚡ HIGH PRIORITY - " : ""}New Contact: ${validatedData.subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: ${priority === "URGENT" ? "#dc2626" : priority === "HIGH" ? "#f59e0b" : "#059669"}; padding: 20px; text-align: center;">
              <h2 style="color: white; margin: 0;">New Contact Form Submission</h2>
              <p style="color: white; opacity: 0.9; margin: 5px 0 0 0;">Priority: ${priority}</p>
            </div>
            
            <div style="padding: 30px 20px; background: white;">
              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="margin-top: 0; color: #374151;">Contact Details</h3>
                <p><strong>Name:</strong> ${validatedData.firstName} ${validatedData.lastName}</p>
                <p><strong>Email:</strong> ${validatedData.email}</p>
                <p><strong>Subject:</strong> ${validatedData.subject}</p>
                <p><strong>Reference ID:</strong> #${contactSubmission.id.slice(-8).toUpperCase()}</p>
                <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
              </div>
              
              <div style="background: white; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px;">
                <h3 style="margin-top: 0; color: #374151;">Message</h3>
                <p style="white-space: pre-wrap; color: #6b7280; line-height: 1.6;">${validatedData.message}</p>
              </div>
            </div>
          </div>
        `,
      })
    } catch (notificationError) {
      console.error("Failed to send team notification:", notificationError)
    }

    return {
      success: true,
      message: "Thank you for your message! We'll get back to you within 24 hours.",
    }
  } catch (error) {
    console.error("Contact form error:", error)

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.errors[0].message,
      }
    }

    return {
      success: false,
      message: "Something went wrong. Please try again.",
    }
  }
}
