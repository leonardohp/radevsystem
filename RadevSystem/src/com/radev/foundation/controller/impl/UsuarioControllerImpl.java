package com.radev.foundation.controller.impl;

import java.util.List;

import org.primefaces.json.JSONObject;

import com.radev.foundation.controller.UsuarioController;
import com.radev.foundation.entity.Usuario;
import com.radev.foundation.persistence.UsuarioDAO;

public class UsuarioControllerImpl implements UsuarioController {
	
	private UsuarioDAO usuarioDAO = new UsuarioDAO();
	
	public Usuario findByLogin(String login) {
		return usuarioDAO.findByLogin(login);
	}
	
	public void persist(Usuario usuario) throws Exception {
		try {
			usuarioDAO.persist(usuario);
		} catch (Exception e) {
			e.printStackTrace();
		}		
	}
	
	public List<Usuario> listAll() {
		return usuarioDAO.listAll();		
	}

}
