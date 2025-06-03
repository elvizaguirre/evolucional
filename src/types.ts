export type Degree = {
  id: number;
  name: string;
};

export type Class = {
  name: string;
};

export type Student = {
  id: number;
  name: string;
  ra: number;
  degreeId: number;
  classId: number;
};

export type Teacher = {
  id: number;
  name: string;
};

export type Matter = {
  id: number;
  name: string;
};

export type Relationship = {
  id: number;
  teacherId: number;
  matterId: number;
  degrees: {
    degreeId: number;
    classes: Array<{
      classId?: number;
      classPosition?: number;
    }>;
  }[];
};