package com.radev.foundation.controller.impl;

import java.util.List;

import org.primefaces.json.JSONObject;

import com.radev.foundation.controller.PedidoController;
import com.radev.foundation.entity.Cliente;
import com.radev.foundation.entity.Pedido;
import com.radev.foundation.persistence.PedidoDAO;

public class PedidoControllerImpl implements PedidoController {
	
	private PedidoDAO pedidoDAO = new PedidoDAO();
	
	public Pedido findById(int login) {
		return pedidoDAO.findById(login);
	}
	
	public void persist(Pedido pedido) throws Exception {
		try {
			pedidoDAO.persist(pedido);
		} catch (Exception e) {
			e.printStackTrace();
		}		
	}
	
	public List<Pedido> listAll() {
		return pedidoDAO.listAll();		
	}
	
	public List<Pedido> listAllLiberar() {
		return pedidoDAO.listAllLiberar();		
	}
	
	public int getLastPedido() {
		return pedidoDAO.getLastPedido();
	}

	public boolean excluir(int p) {			
		return pedidoDAO.excluir(p);

	}
	public boolean liberar(int p) {			
		return pedidoDAO.liberar(p);

	}
	
	public void updateValor(int p, float val) {			
		pedidoDAO.updateValor(p, val);

	}

}
