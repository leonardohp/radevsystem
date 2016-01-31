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
@Table(name="vendedor")

public class Vendedor implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	@Id
	@SequenceGenerator(name = "VENDEDOR_ID", sequenceName = "VENDEDOR_SEQ", allocationSize = 1 )  
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "VENDEDOR_ID" )  
    @Column(name = "vendedor_id", nullable = false, unique=true )	
	private int vendedor_id;
	@Column(nullable = false)
	@Length(max=50)
	private String nome;
	@Column(nullable = false)
	@Length(max=50)
	private String email;	
	@Length(max=50)
	private String cpf;	
	@Length(max=50)
	private String rg;
	public int getId() {
		return vendedor_id;
	}
	public void setId(int vendedor_id) {
		this.vendedor_id = vendedor_id;
	}
	public String getNome() {
		return nome;
	}
	public void setNome(String nome) {
		this.nome = nome;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getCpf() {
		return cpf;
	}
	public void setCpf(String cpf) {
		this.cpf = cpf;
	}
	public String getRg() {
		return rg;
	}
	public void setRg(String rg) {
		this.rg = rg;
	}	

	
	

	

}
