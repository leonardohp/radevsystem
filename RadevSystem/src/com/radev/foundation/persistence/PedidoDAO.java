package com.radev.foundation.persistence;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.Query;

import com.radev.foundation.entity.Pedido;
import com.radev.foundation.persistence.manager.DAOManagerImpl;
import com.radev.foundation.persistence.manager.DBEntityManager;

public class PedidoDAO extends DAOManagerImpl<Object> {

	private Pedido pedido;
	private EntityManager em = DBEntityManager.getConnection();
	private List<Pedido> pedidos = new ArrayList<Pedido>();

	@Override
	public void persist(Object entity) throws Exception, RuntimeException {
		super.persist(entity);

	}

	public Pedido findById(int login) {

		Query q = em
				.createQuery("select u from Pedido u where u.pedido_id = :pLogin ");
		q.setParameter("pLogin", login);

		try {
			return (Pedido) q.getSingleResult();
		} catch (Exception e) {
			return null;
		}

	}

	public int getLastPedido() {

		Query q = em.createQuery("from Pedido order by pedido_id DESC");
		q.setMaxResults(1);

		try {
			Pedido p = (Pedido) q.getSingleResult();
			return p.getId();
		} catch (Exception e) {
			return 0;
		}

	}

	public boolean excluir(int id) {
		try {
			em.getTransaction().begin();
			
			String query = "update Pedido set excluido = 1 where pedido_id ="+ id;
			Query q = em.createNativeQuery(query);
			q.executeUpdate();
			
			em.getTransaction().commit();
			return true;
		} catch (Exception e) {
			em.getTransaction().rollback(); // desfaz transacao se ocorrer erro
											// ao persitir
		} finally {
			if (em.getTransaction().isActive()) {
				em.getTransaction().commit();
			}
		}

		return false;
		// q.setParameter("id", id);
		// q.executeUpdate();
	}
	
	public boolean liberar(int id) {
		try {
			em.getTransaction().begin();
			
			String query = "update Pedido set liberar = 1 where pedido_id ="+ id;
			Query q = em.createNativeQuery(query);
			q.executeUpdate();
			
			em.getTransaction().commit();
			return true;
		} catch (Exception e) {
			em.getTransaction().rollback(); // desfaz transacao se ocorrer erro
											// ao persitir
		} finally {
			if (em.getTransaction().isActive()) {
				em.getTransaction().commit();
			}
		}

		return false;
	}
	
	public void updateValor(int id, float val) {
		try {
			em.getTransaction().begin();
			
			String query = "update Pedido set valor ="+ val +"where pedido_id ="+ id;
			Query q = em.createNativeQuery(query);
			q.executeUpdate();
			
			em.getTransaction().commit();
		} catch (Exception e) {
			em.getTransaction().rollback(); // desfaz transacao se ocorrer erro
											// ao persitir
		} finally {
			if (em.getTransaction().isActive()) {
				em.getTransaction().commit();
			}
		}

	}

	@SuppressWarnings("unchecked")
	public List<Pedido> listAll() {

		try {
			Query query = em
					.createQuery("select p from Pedido p inner join p.clientes c where p.excluido != 1 order by p.pedido_id");

			this.pedidos = Collections.checkedList(query.getResultList(),
					Pedido.class);
		} catch (Exception e) {
			System.out.print(e);
			e.printStackTrace();
		}

		return this.pedidos;

	}
	
	@SuppressWarnings("unchecked")
	public List<Pedido> listAllLiberar() {

		try {
			Query query = em
					.createQuery("select p from Pedido p inner join p.clientes c where p.excluido != 1 and p.liberar != 1 order by p.pedido_id");
			
			this.pedidos = Collections.checkedList(query.getResultList(),
					Pedido.class);
		} catch (Exception e) {
			System.out.print(e);
			e.printStackTrace();
		}

		return this.pedidos;

	}

}
