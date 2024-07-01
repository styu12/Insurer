import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import nodemailer from 'nodemailer'

export const notificationRoutes = async (
  server: FastifyInstance,
  options: FastifyPluginOptions
) => {
  interface EmailRequestBody {
    to: string
    subject: string
    contractStartDate: string // 보험 계약 시작일
    customerName: string // 고객 이름
  }
  server.post('/email',
    {
      schema: {
        tags: ['notifications'],
        description: 'send an email notification',
        summary: 'send an email notification',
        body: {
          type: 'object',
          properties: {
            to: { type: 'string' },
            subject: { type: 'string' },
            contractStartDate: { type: 'string' },
            customerName: { type: 'string' },
          },
        },
        response: {
          200: {
            description: 'Succesful response',
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
            },
          }
        }
      }
    },
    async (request, reply) => {
    const { to, subject, contractStartDate, customerName } =
      request.body as EmailRequestBody

    // 보험 청구일 계산 (계약 시작일로부터 90일 후)
    const startDate = new Date(contractStartDate)
    const claimStartDate = new Date(startDate.setDate(startDate.getDate() + 90))
    const claimStartDateString = claimStartDate.toISOString().split('T')[0] // 'YYYY-MM-DD' 형식

    const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h1 style="color: #4CAF50;">Insurer 서비스 알림</h1>
            <h2>${subject}</h2>
            <p>안녕하세요, ${customerName}님,</p>
            <p>귀하의 보험 계약이 시작된 지 90일이 지났습니다. 이제부터 보험금을 청구하실 수 있습니다.</p>
            <p><strong>보험 계약 시작일:</strong> ${contractStartDate}</p>
            <p><strong>보험 청구 가능 시작일:</strong> ${claimStartDateString}</p>
            <p>Insurer 서비스를 이용해주셔서 감사합니다.</p>
            <p>궁금한 사항이 있으시면 언제든지 연락 주십시오.</p>
            <hr>
            <p style="font-size: 0.9em; color: #555;">본 메일은 자동으로 발송된 메일입니다. 회신하지 마세요.</p>
        </div>
    `

    // 이메일 전송 설정
    let smtpPort = 587
    if (process.env.NAVER_SMTP_PORT) {
      smtpPort = parseInt(process.env.NAVER_SMTP_PORT)
    }
    const transporter = nodemailer.createTransport({
      service: 'naver',
      host: process.env.NAVER_SMTP_HOST, // SMTP 서버명
      port: smtpPort, // SMTP 포트
      auth: {
        user: process.env.NAVER_USER,
        pass: process.env.NAVER_PASS,
      },
    })

    const mailOptions = {
      from: process.env.NAVER_EMAIL,
      to: to,
      subject: subject,
      html: html,
    }

    try {
      await transporter.sendMail(mailOptions)
      reply.send({ success: true, message: 'Email sent successfully' })
    } catch (error) {
      reply
        .status(500)
        .send({ success: false, message: 'Failed to send email', error: error })
    }
  })
}
