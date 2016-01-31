package com.radev.foundation.entity;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import org.hibernate.annotations.Type;
import org.hibernate.validator.constraints.Length;

@Entity
@Table(name="pedidoproduto")

public class PedidoProduto implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	@Id
	@SequenceGenerator(name = "PEDIDOPRODUTO_ID", sequenceName = "PEDIDOPRODUTO_SEQ", allocationSize = 1 )  
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "PEDIDOPRODUTO_ID" )  
    @Column(name = "pedidoproduto_id", nullable = false, unique=true )	
	private int pedidoproduto_id;
	@Column(nullable = false)
	private int qtd;
	@Column(nullable = false)
	private int pedido;
	@Column(nullable = false)
	private int produto;
	@Column(nullable = false)
	private int item;
	@Column(nullable = false, columnDefinition = "int default 0")
	private int excluido;	
	
	public int getId() {
		return pedidoproduto_id;
	}
	public void setId(int pedidoproduto_id) {
		this.pedidoproduto_id = pedidoproduto_id;
	}
	public int getQtd() {
		return qtd;
	}
	public void setQtd(int qtd) {
		this.qtd = qtd;
	}
	public int getPedido() {
		return pedido;
	}
	public void setPedido(int pedido) {
		this.pedido = pedido;
	}
	public int getProduto() {
		return produto;
	}
	public void setProduto(int produto) {
		this.produto = produto;
	}
	public int getItem() {
		return item;
	}
	public void setItem(int item) {
		this.item = item;
	}

	
	
	

	

}
