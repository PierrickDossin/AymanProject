import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";

export enum MealType {
  BREAKFAST = "breakfast",
  LUNCH = "lunch",
  DINNER = "dinner",
  SNACK = "snack"
}

@Entity("meals")
export class Meal {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("varchar")
  userId!: string;

  @Column("varchar")
  name!: string;

  @Column({
    type: "varchar",
    enum: MealType,
    default: MealType.BREAKFAST
  })
  type!: MealType;

  @Column({ type: "date" })
  date!: string;

  @Column({ type: "int", default: 0 })
  calories!: number;

  @Column({ type: "float", default: 0 })
  protein!: number;

  @Column({ type: "float", default: 0 })
  carbs!: number;

  @Column({ type: "float", default: 0 })
  fat!: number;

  @Column({ type: "simple-json", nullable: true })
  items!: Array<{
    id: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.meals, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user!: User;
}
