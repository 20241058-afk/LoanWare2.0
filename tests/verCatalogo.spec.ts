import { test, expect } from '@playwright/test'

const BASE_URL = 'https://gadiel2209.github.io/LoanWare2.0'

test.describe('LoanWare — Catálogo', () => {

  test('PS-LW-01: Debe visualizar el catálogo de equipos correctamente', async ({ page }) => {

    await page.goto(`${BASE_URL}/equipos.html`)

    // Verificar que el título sea correcto
    await expect(page).toHaveTitle(/Equipos Disponibles|LoanWare/)

    // Verificar encabezado del catálogo
    await expect(page.locator('#tituloSeccion')).toHaveText(/Catálogo de Equipos/i)

    // Verificar contenedor de equipos visible
    const contenedor = page.locator('#contenedorEquipos')
    await expect(contenedor).toBeVisible()

    // Esperar a que deje de decir "Cargando..."
    await page.waitForTimeout(3000)

    // Validar que ya no esté el loader
    const loadingText = await contenedor.textContent()
    expect(loadingText).not.toContain('Cargando')

    // Verificar que hay elementos (tarjetas de equipos)
    const equipos = page.locator('#contenedorEquipos > *')
    await expect(equipos.first()).toBeVisible()

    await expect(page.locator('#bannerGuest')).toBeVisible()

    console.log('✅ Catálogo cargado correctamente')
  })

})