## AI-Generated - NOT A WORKING TF FILE! Just an example ##


# Define provider
provider "aws" {
  region = "us-east-1"
}

# Define variables
variable "app_name" {
  default = "my-server-app"
}

variable "app_port" {
  default = 8080
}

variable "aws_account_id" {
  default = "123456789012"
}

# Create ECR repository
resource "aws_ecr_repository" "app_repository" {
  name = var.app_name
}

# Build and push Docker image to ECR repository
resource "docker_image" "app_image" {
  name          = "${aws_ecr_repository.app_repository.repository_url}:${formatdate("YYYYMMDDHHmmss", timestamp())}"
  build_context = "."
  dockerfile    = "Dockerfile"

  registry_auth {
    type        = "ECR"
    registry_id = var.aws_account_id
  }
}

# Create ECS cluster
resource "aws_ecs_cluster" "app_cluster" {
  name = var.app_name
}

# Create ECS task definition
resource "aws_ecs_task_definition" "app_task" {
  family                   = var.app_name
  container_definitions    = jsonencode([{
    name  = var.app_name
    image = docker_image.app_image.name
    portMappings = [{
      containerPort = var.app_port
      protocol      = "tcp"
    }]
  }])
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  network_mode             = "awsvpc"
}

# Create ECS service
resource "aws_ecs_service" "app_service" {
  name            = var.app_name
  cluster         = aws_ecs_cluster.app_cluster.id
  task_definition = aws_ecs_task_definition.app_task.arn
  desired_count   = 1

  load_balancer {
    target_group_arn = aws_lb_target_group.app_target_group.arn
    container_name   = var.app_name
    container_port   = var.app_port
  }

  network_configuration {
    security_groups = [aws_security_group.app_security_group.id]
    subnets         = aws_subnet.app_subnet.*.id
  }
}

# Create load balancer
resource "aws_lb" "app_lb" {
  name               = var.app_name
  internal           = false
  load_balancer_type = "application"
  subnets            = aws_subnet.app_subnet.*.id

  tags = {
    Name = var.app_name
  }
}

# Create target group
resource "aws_lb_target_group" "app_target_group" {
  name     = var.app_name
  port     = var.app_port
  protocol = "HTTP"
  vpc_id   = aws_vpc.app_vpc.id

  health_check {
    path = "/"
  }
}

# Create listener
resource "aws_lb_listener" "app_listener" {
  load_balancer_arn = aws_lb.app_lb.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app_target_group.arn
  }
}

# Create security group
resource "aws_security_group" "app_security_group" {
  name_prefix = var.app_name
  vpc_id      = aws_vpc.app_vpc.id

  ingress {
    from_port   = var.app_port
    to_port     = var.app_port
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Create VPC
resource "aws_vpc" "app_vpc" {
  cidr_block = "10.0.0.0/16"
}

# Create subnets
resource "aws_subnet" "app_subnet" {
  count = 2

  cidr_block = "10.0.${count.index}.0/24"
  vpc_id     = aws_vpc.app_vpc.id

  tags = {
    Name = "${var.app_name}-subnet-${count.index}"
  }
}