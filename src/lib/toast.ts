let toastTimeout: ReturnType<typeof setTimeout>

export function showToast(msg: string) {
  const el = document.getElementById('toast')
  if (!el) return
  el.textContent = msg
  el.classList.add('is-on')
  clearTimeout(toastTimeout)
  toastTimeout = setTimeout(() => el.classList.remove('is-on'), 3800)
}
