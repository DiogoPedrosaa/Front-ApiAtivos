import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AtivoForm from './AtivoForm';
import './Ativos.css';

const Ativos = () => {
    const [ativos, setAtivos] = useState([]);
    const [tags, setTags] = useState([]);
    const [modelos, setModelos] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentAtivo, setCurrentAtivo] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTag, setSelectedTag] = useState('');
    const [setorSearchTerm, setSetorSearchTerm] = useState('');
    const [selectedFabricante, setSelectedFabricante] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        fetchAtivos();
        fetchTags();
        fetchModelos();
    }, []);

    const fetchAtivos = async () => {
        try {
            const response = await axios.get('http://localhost/api/ativos/');
            setAtivos(response.data);
        } catch (error) {
            console.error('Error fetching ativos:', error);
        }
    };
    
    const fetchTags = async () => {
        try {
            const response = await axios.get('http://localhost/api/tags/');
            setTags(response.data);
        } catch (error) {
            console.error('Error fetching tags:', error);
        }
    };
    
    const fetchModelos = async () => {
        try {
            const response = await axios.get('http://localhost/api/fabricantes/');
            setModelos(response.data);
        } catch (error) {
            console.error('Error fetching modelos:', error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost/api/ativos/${id}/`);
            fetchAtivos();
        } catch (error) {
            console.error('Error deleting ativo:', error);
        }
    };

    const handleEdit = (ativo) => {
        setCurrentAtivo(ativo);
        setIsEditing(true);
    };

    const handleAdd = () => {

        if (currentAtivo) {
            
            setCurrentAtivo(null);
            setIsEditing(false);
        } else {

            setCurrentAtivo({}); 
            setIsEditing(false);
        }
    };

    const handleSave = async (ativo) => {
        try {
            if (isEditing) {
                await axios.put(`http://localhost/api/ativos/${currentAtivo.id}/`, ativo);
            } else {
                await axios.post('http://localhost/api/ativos/', ativo);
            }
            fetchAtivos();
            setCurrentAtivo(null);
        } catch (error) {
            console.error('Error saving ativo:', error);
        }
    };

  
    const filterByDate = (data, start, end) => {
        const date = new Date(data);
        const startDate = new Date(start);
        const endDate = new Date(end);

        return date >= startDate && date <= endDate;
    };

    const filteredAtivos = ativos.filter(ativo => {
        const matchesPatrimonio = ativo.patrimonio.toString().includes(searchTerm);
        const matchesTag = selectedTag ? ativo.tag?.id.toString() === selectedTag : true;
        const matchesSetor = setorSearchTerm ? ativo.setor && ativo.setor.nome && ativo.setor.nome.toLowerCase().includes(setorSearchTerm.toLowerCase()) : true;
        const matchesFabricante = selectedFabricante ? ativo.modelo?.id.toString() === selectedFabricante : true;
        const matchesDateRange = startDate && endDate ? filterByDate(ativo.data, startDate, endDate) : true;

        return matchesPatrimonio && matchesTag && matchesSetor && matchesFabricante && matchesDateRange;
    });

    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedTag('');
        setSetorSearchTerm('');
        setSelectedFabricante('');
        setStartDate('');
        setEndDate('');
    };

    return (
        <div>
            <h1>Ativos</h1>
            <input
                type="text"
                placeholder="Pesquisar pelo Patrimônio"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <input
                type="text"
                placeholder="Pesquisar pelo Setor"
                value={setorSearchTerm}
                onChange={(e) => setSetorSearchTerm(e.target.value)}
            />
            <select value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)}>
                <option value="">Selecione o tipo do Periferico</option>
                {tags.map((tag) => (
                    <option key={tag.id} value={tag.id}>{tag.tag}</option>
                ))}
            </select>
            <select value={selectedFabricante} onChange={(e) => setSelectedFabricante(e.target.value)}>
                <option value="">Selecione um Fabricante</option>
                {modelos.map((modelo) => (
                    <option key={modelo.id} value={modelo.id}>{modelo.nome}</option>
                ))}
            </select>
            <div>
                <label>De:</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <label>Até:</label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
            </div>
            <button onClick={handleAdd}>Adicionar Ativo</button>
            <button onClick={handleClearFilters}>Limpar Filtros</button>
            <table>
                <thead>
                    <tr>
                        <th>Patrimônio</th>
                        <th>Serial</th>
                        <th>Defeito</th>
                        <th>Data</th>
                        <th>Tempo de Uso</th>
                        <th>Setor</th>
                        <th>Tipo</th>
                        <th>Fabricante</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredAtivos.map((ativo) => (
                        <tr key={ativo.id}>
                            <td>{ativo.patrimonio}</td>
                            <td>{ativo.serial}</td>
                            <td>{ativo.defeito}</td>
                            <td>{formatDate(ativo.data)}</td>
                            <td>{ativo.tempo_uso}</td>
                            <td>{ativo.setor ? ativo.setor.nome : 'Sem Setor'}</td>
                            <td>{ativo.tag ? ativo.tag.tag : 'Sem Tag'}</td>
                            <td>{ativo.modelo ? ativo.modelo.nome : 'Sem Fabricante'}</td>
                            <td>
                                <button onClick={() => handleEdit(ativo)}>Editar</button>
                                <button onClick={() => handleDelete(ativo.id)}>Excluir</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {currentAtivo && (
                <AtivoForm
                    ativo={currentAtivo}
                    onSave={handleSave}
                    isEditing={isEditing}
                    onCancel={() => setCurrentAtivo(null)}
                />
            )}
        </div>
    );
};

export default Ativos;
