package com.radev.foundation.controller.impl;

import java.util.List;

import org.primefaces.json.JSONObject;

import com.radev.foundation.controller.ProdutoController;
import com.radev.foundation.entity.Produto;
import com.radev.foundation.persistence.ProdutoDAO;

public class ProdutoControllerImpl implements ProdutoController {
	
	private ProdutoDAO produtoDAO = new ProdutoDAO();
	
	public Produto findByLogin(String login) {
		return produtoDAO.findByLogin(login);
	}
	
	public void persist(Produto produto) throws Exception {
		try {
			produtoDAO.persist(produto);
		} catch (Exception e) {
			e.printStackTrace();
		}		
	}
	
	public List<Produto> listAll() {
		return produtoDAO.listAll();		
	}

}
