import React, { useState, useCallback } from "react"
import { Container, Form, SubmitButton } from './styles'
import { FaGithub, FaPlus, FaSpinner } from 'react-icons/fa'
import api from '../../services/api'

function Main() {
    const [newRepo, setNewRepo] = useState('')
    const [repositorios, setRepositorios] = useState([])
    const [loading, setLoading] = useState(false)

    const handleSubmit = useCallback((e) => {
        e.preventDefault()
        async function submit() {
            setLoading(true)

            try {
                const response = await api.get(`repos/${newRepo}`)
                const data = {
                    name: response.data.full_name,
                }

                setRepositorios([...repositorios, data])
                setNewRepo('')
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false)
            }
        }

        submit()
    }, [newRepo, repositorios])



    function handleinputChange(e) {
        setNewRepo(e.target.value)
    }

    return (
        <Container>
            <h1>
                <FaGithub size={25} />
                Meus Repositorios
            </h1>

            <Form onSubmit={handleSubmit}>
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
        </Container>

    )

}


export default Main