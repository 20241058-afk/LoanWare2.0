import { test, expect } from '@playwright/test'

const BASE_URL: string = 'https://gadiel2209.github.io/LoanWare2.0'

test.describe('LoanWare — Login', () => {

    test('PS-LW-02: No debe iniciar sesión con credenciales incorrectas', async ({ page }) => {

        await page.goto(`${BASE_URL}/login.html`)

        await page.fill('#correo', 'prueba.com')
        await page.fill('#password', '123456')

        await page.click('#btnLogin')

        //Esperar a que aparezca la alerta de error
        const alerta = page.locator('#alertaError')
        await expect(alerta).toBeVisible({ timeout: 5000 })

        //Validar mensaje
        const mensaje = page.locator('#mensajeError')
        await expect(mensaje).toHaveText(/Credenciales inválidas/i)

        //Validar que sigue en login
        await expect(page).toHaveURL(/login.html/)
        await page.screenshot({ path: 'login_incorrecto.png', fullPage: true })

        console.log('✅ Login bloqueado correctamente')

    })

})