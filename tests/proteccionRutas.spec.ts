import { test, expect } from '@playwright/test'

const BASE_URL = 'https://gadiel2209.github.io/LoanWare2.0'

test.describe('REQ-23 — Protección de rutas', () => {

  test('PS-LW-04: Acceso sin autenticación a ruta protegida', async ({ page }) => {

    //Ir directamente a una ruta protegida (sin login)
    await page.goto(`${BASE_URL}/perfil.html`)

    //Esperar a que cargue la página
    await page.waitForTimeout(2000)

    //Obtener URL actual
    const urlActual = page.url()

    //Validación principal
    // Esperamos que redirija a login
    const accesoProtegido = !urlActual.includes('login')

    await page.screenshot({
      path: 'evidencias/REQ-23-proteccion-rutas.png',
      fullPage: true
    })
    expect(accesoProtegido).toBeFalsy()

  })

})