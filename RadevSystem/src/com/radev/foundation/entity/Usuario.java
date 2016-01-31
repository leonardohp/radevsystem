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
@Table(name="usuario")

public class Usuario implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	@Id
	@SequenceGenerator(name = "USUARIO_ID", sequenceName = "USUARIO_SEQ", allocationSize = 1 )  
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "USUARIO_ID" )  
    @Column(name = "usuario_id", nullable = false, unique=true )	
	private int usuario_id;
	@Column(nullable = false, unique=true)
	@Length(max=20)
	private String login;
	@Column(nullable = false)
	@Length(max=50)
	private String nome;
	@Column(nullable = false)
	@Length(max=10)
	private String senha;
	@Column
	private int tipo;
	@Type(type= "org.hibernate.type.NumericBooleanType")
	@Column(nullable = false)	
	private boolean ativo;
	@Column(nullable = false)
	@Length(max=50)
	private String email;	

	
	public int getId() {
		return usuario_id;
	}
	public void setId(int id) {
		this.usuario_id = id;
	}
	public String getLogin() {
		return login;
	}
	public void setLogin(String login) {
		this.login = login;
	}
	public String getNome() {
		return nome;
	}
	public void setNome(String nome) {
		this.nome = nome;
	}
	public String getSenha() {
		return senha;
	}
	public void setSenha(String senha) {
		this.senha = senha;
	}
	public int getTipo() {
		return tipo;
	}
	public void setTipo(int tipo) {
		this.tipo = tipo;
	}
	public boolean isAtivo() {
		return ativo;
	}
	public void setAtivo(boolean ativo) {
		this.ativo = ativo;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}

	

}
