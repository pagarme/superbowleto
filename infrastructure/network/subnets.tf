# ===============================================
# DMZ Subnet (public)
# ===============================================

resource "aws_subnet" "dmz" {
  count = "${length(var.az_list)}"
  vpc_id = "${aws_vpc.vpc.id}"
  cidr_block = "${cidrsubnet(var.vpc_cidr, 5, count.index + 0)}"
  map_public_ip_on_launch = true
  availability_zone = "${element(var.az_list, count.index)}"

  tags {
    Name = "${var.vpc_name} DMZ Subnet - AZ ${element(var.az_list, count.index)}"
    Public = "true"
  }
}

resource "aws_route_table" "dmz" {
  vpc_id = "${aws_vpc.vpc.id}"

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = "${aws_internet_gateway.internet_gateway.id}"
  }

  tags {
    Name = "${var.vpc_name} DMZ Route Table"
  }
}

resource "aws_route_table_association" "dmz" {
  count = "${length(var.az_list)}"
  subnet_id = "${element(aws_subnet.dmz.*.id, count.index)}"
  route_table_id = "${aws_route_table.dmz.id}"
}

resource "aws_nat_gateway" "nat_gateway" {
  subnet_id = "${aws_subnet.dmz.0.id}"
  allocation_id = "${aws_eip.nat_gateway.id}"
  depends_on = ["aws_internet_gateway.internet_gateway"]
}

# ===============================================
# Lambda Subnet (private)
# ===============================================

resource "aws_subnet" "lambda" {
  count = "${length(var.az_list)}"
  vpc_id = "${aws_vpc.vpc.id}"
  cidr_block = "${cidrsubnet(var.vpc_cidr, 5, count.index + 5)}"
  map_public_ip_on_launch = false
  availability_zone = "${element(var.az_list, count.index)}"

  tags {
    Name = "${var.vpc_name} Lambda Subnet - AZ ${element(var.az_list, count.index)}"
    Public = "false"
  }
}

resource "aws_route_table" "lambda" {
  vpc_id = "${aws_vpc.vpc.id}"

  route {
    cidr_block = "0.0.0.0/0"
    nat_gateway_id = "${aws_nat_gateway.nat_gateway.id}"
  }

  tags {
    Name = "${var.vpc_name} Lambda Route Table"
  }
}

resource "aws_route_table_association" "lambda" {
  count = "${length(var.az_list)}"
  subnet_id = "${element(aws_subnet.lambda.*.id, count.index)}"
  route_table_id = "${aws_route_table.lambda.id}"
}

# ===============================================
# Database Subnet (private)
# ===============================================

resource "aws_subnet" "database" {
  count = "${length(var.az_list)}"
  vpc_id = "${aws_vpc.vpc.id}"
  cidr_block = "${cidrsubnet(var.vpc_cidr, 5, count.index + 10)}"
  map_public_ip_on_launch = false
  availability_zone = "${element(var.az_list, count.index)}"

  tags {
    Name = "${var.vpc_name} Database Subnet - AZ ${element(var.az_list, count.index)}"
    Public = "true"
  }
}

resource "aws_db_subnet_group" "database" {
  name = "superbowleto_database_subnet_group"
  description = "Superbowleto Database Subnet Group"
  subnet_ids = ["${aws_subnet.database.*.id}"]

  tags {
    Name = "Superbowleto Database Subnet Group"
  }
}
