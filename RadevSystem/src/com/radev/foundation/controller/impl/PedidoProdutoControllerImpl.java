package com.radev.foundation.controller.impl;

import java.util.List;

import org.primefaces.json.JSONObject;

import com.radev.foundation.controller.PedidoProdutoController;
import com.radev.foundation.entity.PedidoProduto;
import com.radev.foundation.persistence.PedidoProdutoDAO;

public class PedidoProdutoControllerImpl implements PedidoProdutoController {
	
	private PedidoProdutoDAO pedidoProdutoDAO = new PedidoProdutoDAO();
	
	public PedidoProduto findByLogin(String login) {
		return pedidoProdutoDAO.findByLogin(login);
	}
	
	public void persist(PedidoProduto pedidoProduto) throws Exception {
		try {
			pedidoProdutoDAO.persist(pedidoProduto);
		} catch (Exception e) {
			e.printStackTrace();
		}		
	}
	
	public List<PedidoProduto> listAll() {
		return pedidoProdutoDAO.listAll();		
	}

	public boolean excluir(int p) {			
		return pedidoProdutoDAO.excluir(p);

	}

}
