package com.radev.foundation.view;

import java.io.Serializable;
import java.util.List;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.ViewScoped;

import com.radev.foundation.controller.UsuarioController;
import com.radev.foundation.controller.impl.UsuarioControllerImpl;
import com.radev.foundation.entity.Usuario;

@ViewScoped
@ManagedBean
public class UsuarioDataGridView implements Serializable {
	
	private static final long serialVersionUID = 1L;
	private List<Usuario> usuarios;
	private Usuario usuario;
	
	public List<Usuario> getAllUsuarios() {
		UsuarioController usuarioController = new UsuarioControllerImpl();
		usuarios = usuarioController.listAll();
		return usuarios;		
	}
	
	public Usuario getUsuario() {
		if (usuario == null) 
			usuario = new Usuario();
		return usuario;			
	}
	
	public void setUsuario(Usuario usuario) {
		this.usuario = usuario;
	}
}
