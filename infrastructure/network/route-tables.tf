resource "aws_route_table" "dmz" {
  vpc_id = "${aws_vpc.vpc.id}"

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = "${aws_internet_gateway.internet_gateway.id}"
  }

  tags {
    Name = "superbowleto DMZ Route Table"
  }
}

resource "aws_route_table_association" "dmz" {
  count = "${length(var.az_list)}"
  subnet_id = "${element(aws_subnet.dmz.*.id, count.index)}"
  route_table_id = "${aws_route_table.dmz.id}"
}

resource "aws_route_table" "lambda" {
  vpc_id = "${aws_vpc.vpc.id}"

  route {
    cidr_block = "0.0.0.0/0"
    nat_gateway_id = "${aws_nat_gateway.nat_gateway.id}"
  }

  tags {
    Name = "superbowleto Lambda Route Table"
  }
}

resource "aws_route_table_association" "lambda" {
  count = "${length(var.az_list)}"
  subnet_id = "${element(aws_subnet.lambda.*.id, count.index)}"
  route_table_id = "${aws_route_table.lambda.id}"
}
