const resetPasswordEmail = ({
  name,
  resetUrl,
}: {
  name: string;
  resetUrl: string;
}) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title>Reset Your Password - Craveo</title>
</head>

<body style="
  margin: 0;
  padding: 0;
  background-color: #f5f5f5;
  font-family: Arial, Helvetica, sans-serif;
  color: #171717;
">

  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="background-color: #f5f5f5; padding: 40px 15px;"
  >
    <tr>
      <td align="center">

        <!-- Main Container -->
        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            max-width: 600px;
            background-color: #ffffff;
            border-radius: 18px;
            overflow: hidden;
            box-shadow: 0 8px 30px rgba(0,0,0,0.06);
          "
        >

          <!-- Header -->
          <tr>
            <td
              align="center"
              style="
                background-color: #ef3901;
                padding: 32px 20px;
              "
            >
              <h1 style="
                margin: 0;
                color: #ffffff;
                font-size: 32px;
                font-weight: 800;
                letter-spacing: -1px;
              ">
                Craveo
              </h1>

              <p style="
                margin: 8px 0 0;
                color: #fff7ed;
                font-size: 14px;
              ">
                Your cravings, delivered.
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 45px 40px 35px;">

              <h2 style="
                margin: 0 0 15px;
                font-size: 26px;
                line-height: 1.3;
                color: #171717;
              ">
                Reset your password 🔐
              </h2>

              <p style="
                margin: 0 0 20px;
                font-size: 16px;
                line-height: 1.7;
                color: #525252;
              ">
                Hey ${name},
              </p>

              <p style="
                margin: 0 0 25px;
                font-size: 16px;
                line-height: 1.7;
                color: #525252;
              ">
                We received a request to reset the password
                for your Craveo account.
              </p>

              <p style="
                margin: 0 0 30px;
                font-size: 16px;
                line-height: 1.7;
                color: #525252;
              ">
                Click the button below to create a new password.
              </p>

              <!-- Button -->
              <table
                cellpadding="0"
                cellspacing="0"
                border="0"
                width="100%"
              >
                <tr>
                  <td align="center">

                    <a
                      href="${resetUrl}"
                      target="_blank"
                      style="
                        display: inline-block;
                        background-color: #ef3901;
                        color: #ffffff;
                        text-decoration: none;
                        font-size: 16px;
                        font-weight: 700;
                        padding: 15px 32px;
                        border-radius: 10px;
                      "
                    >
                      Reset My Password
                    </a>

                  </td>
                </tr>
              </table>

              <!-- Security Notice -->
              <div style="
                margin-top: 35px;
                padding: 18px;
                background-color: #fff7ed;
                border-radius: 10px;
                border-left: 4px solid #ef3901;
              ">

                <p style="
                  margin: 0;
                  font-size: 14px;
                  line-height: 1.6;
                  color: #525252;
                ">
                  <strong style="color: #171717;">
                    Didn't request this?
                  </strong>
                  You can safely ignore this email.
                  Your password will remain unchanged.
                </p>

              </div>

              <!-- Expiration -->
              <p style="
                margin: 30px 0 0;
                font-size: 13px;
                line-height: 1.6;
                color: #737373;
              ">
                For security reasons, this password reset link
                will expire soon.
              </p>

              <!-- Fallback URL -->
              <p style="
                margin: 20px 0 0;
                font-size: 12px;
                line-height: 1.6;
                color: #a3a3a3;
                word-break: break-all;
              ">
                If the button doesn't work, copy and paste this link
                into your browser:
                <br />
                ${resetUrl}
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td
              align="center"
              style="
                padding: 25px 30px;
                background-color: #fafafa;
                border-top: 1px solid #eeeeee;
              "
            >

              <p style="
                margin: 0 0 8px;
                font-size: 14px;
                font-weight: 700;
                color: #171717;
              ">
                Craveo
              </p>

              <p style="
                margin: 0;
                font-size: 12px;
                color: #a3a3a3;
                line-height: 1.5;
              ">
                Delicious food. Delivered to you.
              </p>

              <p style="
                margin: 12px 0 0;
                font-size: 11px;
                color: #b5b5b5;
              ">
                © ${new Date().getFullYear()} Craveo. All rights reserved.
              </p>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;
};
export default resetPasswordEmail;
