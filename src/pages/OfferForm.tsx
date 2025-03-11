import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import Offer from '../models/Offer'
import { OfferService } from '../services/offer.services'
import { useNavigate, useParams } from 'react-router-dom'
import { Temporal } from 'temporal-polyfill'
import toast from 'react-hot-toast'
import { CategoryService } from '../services/categoryService'
import Category from '../models/Category'
import InputForm from '../components/InputForm'
import ErrorMsgData from '../utils/ErrorMsgData'
import TextAreaInputForm from '../components/TextAreaInputForm'

// - formulario de creación de 1 oferta
// -- Actualizar una oferta

function OfferForm() {
  const now = Temporal.Now.plainDateTimeISO()
  const threeMonthLater = now.add({months: 3}).toString().slice(0,16)

  const [form, setForm] = useState<Partial<Offer>>({
    title: '',
    price: 0, 
    description: '',
    active: true,
    contactEmail: '',
    location: '',
    published: new Date().toISOString().slice(0,16), //2007-11-03T16:18:05Z ->  2007-11-03T16:18
    expired: threeMonthLater,
    idCategory: undefined
  })
  
  const [categorias, setCategorias] = useState<Category[]>()
  const {id} = useParams()
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if(id){
      setLoading(true)
      OfferService.getById(Number(id))
      .then(data => setForm({
        ...data,
        published: new Date(data.published || '').toISOString().slice(0,16),
        expired: new Date(data.expired || '').toISOString().slice(0,16)
      }))
      .catch((error) => setErrors(error.message))
      .finally(()=>setLoading(false))
    }
  }, [id])

  useEffect(() => {
    CategoryService.getAll()
      .then(setCategorias)
      .catch(error => setErrors(error.message))
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    try {
      setLoading(true)
      setErrors({});
      e.preventDefault()
      const formData = {
        ...form,
        idCategory: form.idCategory ? Number(form.idCategory) : null,
        published: new Date(form.published || '').toISOString(),
        expired: new Date(form.expired || '').toISOString(),
        price: form.price,  // Asegúrate de enviar el precio
      }
      console.log(formData)
      if(id) await OfferService.update(Number(id), formData)
      else await OfferService.create(formData)
      toast.success('Oferta guardada correctamente!')
      navigate('/offers')
    } catch (error) {
      toast.error('Error al guardar la oferta!')
      if(Array.isArray(error)){
        const errorObj: Record<string, string> = error?.reduce((acc: Record<string, string>, err: unknown) => {
          const errorDetail = err as ErrorMsgData;
          acc[errorDetail.path] = errorDetail.msg;
          return acc;
        }, {});
        setErrors(errorObj);
      } else if (error instanceof Error) {
        const msg = error instanceof Error ? error.message : "Error desconocido"
        setErrors({ message: msg || 'Error desconocido' });
      } else {
        setErrors({ message: error as string || 'Error desconocido' });
      }
    } finally {
      setLoading(false)
    }
  }

  // Aquí está el nuevo handleChange que maneja el 'price' específicamente
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { value, name } = e.target;

    // Convierte 'price' a un número si el campo es 'price'
    if (name === 'price') {
      setForm({ ...form, [name]: value ? parseFloat(value) : undefined });  // El valor se convierte a float si no está vacío
    } else {
      setForm({ ...form, [name]: value });
    }
  }

  if(loading) return <p>Loading...</p>

  return (
    <div className='text-white flex flex-col'>
      <h2 className="text-4xl font-extrabold dark:text-white">{id ? 'Edición de oferta' : 'Inserción de nueva oferta'}</h2>

      <form className="max-w-sm mx-auto min-w-sm" onSubmit={handleSubmit}>
      
        <InputForm text="Título" name="title" value={form.title || ''} handleChange={handleChange} error={errors.title} />
        <TextAreaInputForm type="textarea" rows={6} text="Descripción" name="description" value={form.description || ''} handleChange={handleChange} error={errors.description} />
        
        <InputForm text="Email de contacto" name="contactEmail" value={form.contactEmail || ''} handleChange={handleChange} error={errors.contactEmail} />
        <InputForm text="Localización" name="location" value={form.location || ''} handleChange={handleChange} error={errors.location} />
        
        <InputForm type="datetime-local" text="Fecha publicación:" name="published" value={form.published || ''} handleChange={handleChange} error={errors.published} />
        <InputForm type="datetime-local" text="Fecha Finalización:" name="expired" value={form.expired || ''} handleChange={handleChange} error={errors.expired} />
        <InputForm type="checkbox" text="Activa" name="active" checked={form.active} handleChange={handleChange} error={errors.active} />

        {/* Campo Precio */}
        <InputForm text="Precio" name="price" value={form.price !== undefined ? form.price.toString() : ''} handleChange={handleChange} error={errors.price} type="number" />
        
        <label htmlFor="idCategory" className="block mb-2 text-sm font-medium text-green-900 dark:text-white">Categoría:</label>
        <select id="idCategory" name="idCategory" value={form.idCategory ?? ""} onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-green-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-green-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500">
          <option value="">Selecciona categoria</option>
          {categorias?.map(categoria => 
            <option key={categoria.id} value={categoria.id}> {categoria.name} </option>
          )}
        </select>

        {errors && errors.message && <p className="text-center mt-4 text-red-500">{errors.message}</p>}

        <button type="submit"
          className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
          Guardar
        </button>
      </form>
    </div>
  )
}

export default OfferForm;
