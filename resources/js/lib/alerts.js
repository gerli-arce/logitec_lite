import Swal from "sweetalert2"

const baseToast = (opts) =>
  Swal.fire({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2400,
    timerProgressBar: true,
    ...opts,
  })

export const toastSuccess = (title, options = {}) =>
  baseToast({
    icon: "success",
    title,
    ...options,
  })

export const toastError = (title, options = {}) =>
  baseToast({
    icon: "error",
    title,
    ...options,
  })
