import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("exercises")
export class Exercise {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("varchar")
  name!: string;

  @Column("varchar")
  muscleGroup!: string; // chest, back, legs, shoulders, arms, core, cardio

  @Column("varchar", { nullable: true })
  equipment!: string; // barbell, dumbbell, machine, bodyweight, cable, etc.

  @Column("text", { nullable: true })
  description!: string;

  @Column("varchar", { nullable: true })
  imageUrl!: string;

  @Column("float", { default: 0 })
  rating!: number;

  @Column("varchar", { default: "intermediate" })
  difficulty!: string; // beginner, intermediate, advanced

  @Column("varchar", { default: "strength" })
  type!: string; // strength, cardio, flexibility

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
