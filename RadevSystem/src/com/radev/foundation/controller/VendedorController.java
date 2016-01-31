package com.radev.foundation.controller;

import java.util.List;

import com.radev.foundation.entity.Vendedor;


public interface VendedorController {
	public Vendedor findByLogin(String login);
	public void persist(Vendedor cliente) throws Exception;
	public List<Vendedor> listAll();
}
