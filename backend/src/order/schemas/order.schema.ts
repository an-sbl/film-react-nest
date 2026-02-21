import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Ticket {
  @Prop({ required: true })
  film: string;

  @Prop({ required: true })
  session: string;

  @Prop()
  day: string;

  @Prop()
  time: string;

  @Prop()
  daytime: string;

  @Prop({ required: true })
  row: number;

  @Prop({ required: true })
  seat: number;

  @Prop({ required: true })
  price: number;
}

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ type: [Ticket], required: true })
  tickets: Ticket[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
