package com.radev.foundation.controller;

import java.util.List;

import com.radev.foundation.entity.Usuario;

public interface UsuarioController {
	public Usuario findByLogin(String login);
	public void persist(Usuario usuario) throws Exception;
	public List<Usuario> listAll();
}
