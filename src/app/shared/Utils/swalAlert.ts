import Swal from 'sweetalert2';
import { AuthError, AuthMessage } from '../services/user.service';


export function showError(error: AuthError): void {
  Swal.fire(
    error.code,
    error.message,
    'error'
  )
}

export function showSuccess(message: AuthMessage) {
  Swal.fire(
    message.code,
    message.message,
    'success'
  )
}
