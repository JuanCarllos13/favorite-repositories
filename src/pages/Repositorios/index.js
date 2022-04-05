import React, { useState, useEffect } from "react"
import { Container, Owner, Loading, BackButton, IssuesList } from './styles'
import {FaArrowLeft} from 'react-icons/fa'
import api from '../../services/api'

function Repositorio({ match }) {
    const [repositorio, setRepositorio] = useState({})
    const [issues, setIssues] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function load() {
            const nomeRepo = decodeURIComponent(match.params.repositorio)

            // const response = awai api.get('/repos)

            const [repositorioData, issuesData] = await Promise.all([
                api.get(`/repos/${nomeRepo}`),
                api.get(`/repos/${nomeRepo}/issues`, {
                    params: {
                        state: 'open',
                        per_page: 5
                    }
                })
            ]);
            setRepositorio(repositorioData.data)
            setIssues(issuesData.data)
            setLoading(false)

        }
        load()

    }, [match.params.repositorio])


    if(loading){
        return(
            <Loading>
                <h1> Carregando</h1>
            </Loading>
        )
     
    }

    return (
        <Container>
            <BackButton to={'/'}>
                <FaArrowLeft  color={'#000'} size={30}/>

            </BackButton>
            <Owner>
                <img src={repositorio.owner.avatar_url} alt={repositorio.owner.login} />
                <h1>{repositorio.name}</h1>
                <p> {repositorio.description} </p>
            </Owner>

        <IssuesList>
        {issues.map(issue => (
            <li key={ String(issue.id)}>
                <img src={issue.user.avatar_url} alt={issue.user.login} />

                <div>
                    <strong>
                        <a href={issue.html_url}> {issue.title} </a>

                        {issue.labels.map(label => (
                            <span key={String(label.id)}>
                                {label.name}
                            </span>
                        ))}
                    </strong>
                            <p> {issue.user.login} </p>

                </div>

            </li>
        ))}
        </IssuesList>



        </Container>

    )

}
export default Repositorio