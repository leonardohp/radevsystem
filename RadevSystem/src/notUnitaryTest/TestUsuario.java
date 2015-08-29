package notUnitaryTest;

import com.radev.foundation.controller.UsuarioController;
import com.radev.foundation.controller.impl.UsuarioControllerImpl;
import com.radev.foundation.entity.Usuario;
import com.radev.foundation.utils.TipoUsuario;

public class TestUsuario {
	
	public static void main(String args[]) {
		
		Usuario usuario = new Usuario();
		usuario.setLogin("Dener");
		usuario.setNome("Dener Cezar Lopes de Alencar");
		usuario.setSenha("senha");
		usuario.setTipo(TipoUsuario.SUPER.tipoUsuario);
		usuario.setAtivo(true);
		usuario.setEmail("deneralencar@gmail.com");
		
		UsuarioController usuarioController = new UsuarioControllerImpl();
		
		try {
			usuarioController.persist(usuario);
		} catch (RuntimeException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
		
	}

}
