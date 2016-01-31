package com.radev.foundation.controller;

import java.util.List;

import com.radev.foundation.entity.Produto;

public interface ProdutoController {
	public Produto findByLogin(String login);
	public void persist(Produto cliente) throws Exception;
	public List<Produto> listAll();
}
