package com.radev.foundation.persistence;

import javax.persistence.EntityManager;
import javax.persistence.Query;

import com.radev.foundation.entity.Empresa;
import com.radev.foundation.persistence.manager.DAOManagerImpl;
import com.radev.foundation.persistence.manager.DBEntityManager;

public class EmpresaDAO extends DAOManagerImpl<Object> {
	
	private Empresa empresa;
	private EntityManager em = DBEntityManager.getConnection();
	
	@Override
	public void persist(Object entity) throws Exception, RuntimeException {
		
		empresa = findByCodigo(((Empresa)entity).getCodigo());
		
		if (empresa == null)
			super.persist(entity);
		else {
			int id = empresa.getId();
			
			empresa = (Empresa)entity;
			empresa.setId(id);
			
			super.merge(empresa);
		}
	}

	public Empresa findByCodigo(int codigo) {
		
		Query q = em.createQuery("select e from Empresa e where e.codigo = :pCodigo ");
		q.setParameter("pCodigo", codigo); 
		
		try {
			return (Empresa)q.getSingleResult();
		} catch (Exception e) {
			return null;
		}
		
	}

	public Empresa findFirst() {
		Query q = em.createQuery("select e from Empresa e ");
		
		try {
			return (Empresa)q.getSingleResult();
		} catch (Exception e) {
			return null;
		}
	}
	

}
