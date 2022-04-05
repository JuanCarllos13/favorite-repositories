import React, { useState, useCallback, useEffect } from "react"
import { Container, Form, SubmitButton, List, DeleteButton } from './styles'
import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from 'react-icons/fa'
import api from '../../services/api'
import { Link } from "react-router-dom"

function Main() {
    const [newRepo, setNewRepo] = useState('')
    const [repositorios, setRepositorios] = useState([])
    const [loading, setLoading] = useState(false)
    const [alert, setAlert] = useState(null)

    //DidMount - Buscar
    useEffect(() => {
        const repoStorage = localStorage.getItem('repos')

        if (repositorios) {
            setRepositorios(JSON.parse(repoStorage))
        }
    }, [])




    // DIdUpdate - Salvar alteraçoes

    useEffect(() => {
        localStorage.setItem('repos', JSON.stringify(repositorios))
    }, [repositorios])


    const handleSubmit = useCallback((e) => {
        e.preventDefault()
        async function submit() {
            setLoading(true)
            setAlert(null)

            try {
                if (newRepo === '') {
                    throw new Error("Você precisa indicar um repositorio")
                }
                const response = await api.get(`repos/${newRepo}`)

                const hasRepo = repositorios.find(repo => repo.name === newRepo)

                if (hasRepo) {
                    throw new Error("Repositorio duplicado")
                }

                const data = {
                    name: response.data.full_name,
                }

                setRepositorios([...repositorios, data])
                setNewRepo('')
            } catch (err) {
                setAlert(true)
                console.log(err)

            } finally {
                setLoading(false)
            }
        }

        submit()
    }, [newRepo, repositorios])



    function handleinputChange(e) {
        setNewRepo(e.target.value)
        setAlert(null)
    }

    const handleDelete = useCallback((repo) => {
        const find = repositorios.filter(e => e.name !== repo)
        setRepositorios(find)
    }, [repositorios])

    return (
        <Container>
            <h1>
                <FaGithub size={25} />
                Meus Repositorios
            </h1>

            <Form onSubmit={handleSubmit} error={alert}>
                <input type={'text'} placeholder='Adicionar Repositoeios'
                    onChange={handleinputChange}
                    value={newRepo} />

                <SubmitButton loading={loading ? 1 : 0} >
                    {loading ? (
                        <FaSpinner color="#FFF" size={14} />
                    ) : (
                        <FaPlus size={25} color={'#FFF'} />
                    )}

                </SubmitButton>
            </Form>

            <List>
                {repositorios.map(repo => (
                    <li key={repo.name}>
                        <span>
                            <DeleteButton onClick={() => handleDelete(repo.name)}>
                                <FaTrash size={14} />
                            </DeleteButton>
                            {repo.name}
                        </span>
                        <Link to={`/repositorio/${encodeURIComponent(repo.name)}`}> {/*Avisando que é um paramentro e não uma pagina na url */}
                            <FaBars size={20} />
                        </Link>
                    </li>
                ))}

            </List>

        </Container>

    )

}


export default Main