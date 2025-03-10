import { FormEvent, useEffect, useState } from "react"
import { CategoryService } from "../services/categoryService"
import Category from "../models/Category"

interface CategoryFormProps {
    onSubmit: (e: FormEvent, name: string) => void
}

function CategoryForm({ onSubmit }: CategoryFormProps) {
    const [name, setName] = useState('')

    return (
        <form 
            onSubmit={(e) => onSubmit(e, name)} 
            className="bg-linear-to-bl from-green-300 to-green-600 p-6 rounded-lg shadow-md max-w-md mx-auto space-y-4 mt-6"
        >
            <label htmlFor="name" className="block text-white font-semibold">Nombre:</label>
            <input 
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 rounded-md border border-gray-600 bg-white text-green-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Escribe una categoría..."
            />
            <button 
                type="submit"
                className="w-full bg-green-400  text-white font-bold py-2 px-4 rounded-md hover:bg-green-900 transition duration-300"
            >
                Guardar
            </button>
        </form>
    )
}

interface CategoryListProps {
    categories: Category[]
    onDelete: (id: number) => void
}

function CategoryList({ categories, onDelete }: CategoryListProps) {
    return (
        <div className="max-w-lg mx-auto mt-6 space-y-2">
            {categories.length === 0 ? (
                <p className="text-gray-400 text-center">No hay categorías aún.</p>
            ) : (
                categories.map(category => (
                    <div 
                        key={category.id} 
                        className="bg-green-600 p-4 rounded-lg shadow-md flex justify-between items-center"
                    >
                        <span className="text-white font-semibold">{category.name}</span>
                        <button
                            onClick={() => onDelete(category.id)}
                            className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition duration-300"
                        >
                            Borrar
                        </button>
                    </div>
                ))
            )}
        </div>
    )
}

function CategoryManager() {
    const [categories, setCategories] = useState<Category[]>([])

    useEffect(() => {
        CategoryService
            .getAll()
            .then(setCategories)
    }, [])

    const handleCreate = async (e: FormEvent, name: string) => {
        e.preventDefault()
        const nuevaCategory = await CategoryService.create({ name })
        setCategories([...categories, nuevaCategory])
    }

    const handleDelete = (id: number) => {
        if (!window.confirm("¿Estás seguro que quieres borrar esta categoría?")) return
        CategoryService.delete(id)
        setCategories(categories?.filter((category) => category.id !== id))
    }

    return (
        <div className="p-6">
            <h1 className="text-4xl font-extrabold text-white text-center">Gestión de Categorías</h1>
            <CategoryForm onSubmit={handleCreate} />
            <CategoryList categories={categories} onDelete={handleDelete} />
        </div>
    )
}

export default CategoryManager
