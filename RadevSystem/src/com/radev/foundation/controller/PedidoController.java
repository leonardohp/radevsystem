package com.radev.foundation.controller;

import java.util.List;

import com.radev.foundation.entity.Pedido;
import com.radev.foundation.entity.Usuario;

public interface PedidoController {
	public Pedido findById(int login);
	public void persist(Pedido cliente) throws Exception;
	public List<Pedido> listAll();
	public List<Pedido> listAllLiberar();
	public int getLastPedido();
	public boolean excluir(int p);
	public boolean liberar(int p);
	public void updateValor(int p, float val);
}
