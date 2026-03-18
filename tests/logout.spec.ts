import { test, expect } from '@playwright/test'

const BASE_URL = 'https://gadiel2209.github.io/LoanWare2.0'

test.describe('LoanWare — Logout', () => {

  test('PS-LW-03: Cierre de sesión seguro', async ({ page }) => {

    //Login
    await page.goto(`${BASE_URL}/login.html`)

    await page.fill('#correo', '20240994@uthh.edu.mx')
    await page.fill('#password', 'Adrian123')
    await page.click('#btnLogin')

    // Esperar que cambie de página
    await page.waitForTimeout(3000)

    //Ir al perfil (donde está el logout)
    await page.goto(`${BASE_URL}/perfil.html`)

    //Verificar botón de logout
    const logoutBtn = page.locator('text=CERRAR SESIÓN')
    await expect(logoutBtn).toBeVisible()

    //Hacer logout
    await logoutBtn.click()

    //Validar redirección a login
    await expect(page).toHaveURL(/login.html/)

    await page.screenshot({ path: 'evidencias/logout.png', fullPage: true })

    console.log('✅ Logout funcionando correctamente')

  })

})