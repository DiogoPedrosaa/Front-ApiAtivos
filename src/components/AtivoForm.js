import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AtivoForm = ({ ativo, onSave, isEditing, onCancel }) => {
    const [fabricantes, setFabricantes] = useState([]);
    const [tags, setTags] = useState([]); 
    const [setores, setSetores] = useState([]); 
    const [formData, setFormData] = useState(ativo || {});

    useEffect(() => {
        const fetchFabricantes = async () => {
            try {
                const response = await axios.get('http://localhost/api/fabricantes/');
                setFabricantes(response.data);
            } catch (error) {
                console.error('Error fetching fabricantes:', error);
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
        
        const fetchSetores = async () => {
            try {
                const response = await axios.get('http://localhost/api/setores/');
                setSetores(response.data);
            } catch (error) {
                console.error('Error fetching setores:', error);
            }
        };

        fetchFabricantes();
        fetchTags(); 
        fetchSetores(); 
    }, []);

    useEffect(() => {
        setFormData(ativo);
    }, [ativo]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Patrimônio:
                <input
                    type="number"
                    name="patrimonio"
                    value={formData.patrimonio || ''}
                    onChange={handleChange}
                />
            </label>
            <label>
                Serial:
                <input
                    type="text"
                    name="serial"
                    value={formData.serial || ''}
                    onChange={handleChange}
                />
            </label>
            <label>
                Defeito:
                <input
                    type="text"
                    name="defeito"
                    value={formData.defeito || ''}
                    onChange={handleChange}
                />
            </label>
            <label>
                Data:
                <input
                    type="date"
                    name="data"
                    value={formData.data || ''}
                    onChange={handleChange}
                />
            </label>
            <label>
                Tempo de Uso:
                <input
                    type="text"
                    name="tempo_uso"
                    value={formData.tempo_uso || ''}
                    onChange={handleChange}
                />
            </label>
            <label>
                Setor:
                <select
                    name="setor_id"
                    value={formData.setor_id || ''}
                    onChange={handleChange}
                >
                    
                    {setores.map((setor) => (
                        <option key={setor.id} value={setor.id}>
                            {setor.nome}
                        </option>
                    ))}
                </select>
            </label>
            <label>
                Modelo:
                <select
                    name="modelo_id"
                    value={formData.modelo_id || ''}
                    onChange={handleChange}
                >
                    <option value="">Selecione um modelo</option>
                    {fabricantes.map((fabricante) => (
                        <option key={fabricante.id} value={fabricante.id}>
                            {fabricante.nome}
                        </option>
                    ))}
                </select>
            </label>
            <label>
                Tipo de Periferico:
                <select
                    name="tag_id"
                    value={formData.tag_id || ''}
                    onChange={handleChange}
                >
                    <option value="">Selecione uma tag</option>
                    {tags.map((tag) => ( 
                        <option key={tag.id} value={tag.id}>
                            {tag.tag}
                        </option>
                    ))}
                </select>
            </label>
            <button type="submit">{isEditing ? 'Atualizar' : 'Adicionar'} Ativo</button>
            <button type="button" onClick={onCancel}>Cancelar</button>
        </form>
    );
};

export default AtivoForm;
