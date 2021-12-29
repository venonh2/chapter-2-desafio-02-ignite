import { useEffect, useState } from "react";

import { Header } from "../../components/Header";
import { FoodCard } from "../../components/Food";
import { ModalAddFood } from "../../components/ModalAddFood";
import { ModalEditFood } from "../../components/ModalEditFood";

import { FoodsContainer } from "./styles";

import api from "../../services/api";
import { Food } from "../../types";

export function Dashboard() {
  const [foods, setfoods] = useState<Food[]>([]);
  const [editingFood, setEditingFood] = useState<Food>({} as Food);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function GetFoods() {
      const response = await api.get("/foods");
      setfoods(response.data);
    }
    GetFoods();
  }, []);

  async function handleAddFood(food: Food) {
    try {
      const response = await api.post("/foods", {
        ...food,
        available: true,
      });

      setfoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(food: Food) {
    try {
      const foodUpdated = await api.put(`/foods/${editingFood.id}`, {
        ...editingFood,
        ...food,
      });

      const foodsUpdated = foods.map((_food) =>
        _food.id !== foodUpdated.data.id ? _food : foodUpdated.data
      );
      setfoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(foodId: number) {
    await api.delete(`/foods/${foodId}`);
    const foodsFiltered = foods.filter((food) => food.id !== foodId);
    setfoods(foodsFiltered);
  }

  function toggleModal() {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal() {
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: Food) {
    setEditingFood(food);
    setEditModalOpen(true);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map((food) => (
            <FoodCard
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}
